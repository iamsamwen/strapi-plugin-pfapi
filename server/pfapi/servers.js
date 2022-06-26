'use strict';

const { RedisPubsub,  Cacheable, get_dependency_key } = require('./');;

const helpers = require('./helpers');

const config_uid = helpers.config_uid;
const handle_uid = helpers.handle_uid;

class Servers extends RedisPubsub {

    constructor(app) {
        super(app.redis_cache);
        this.app = app;
        this.instances = [];
        this.subscribed_uids = [];
    }

    is_primary() {
        if (this.instances.length === 0) return false;
        return this.uuid === this.instances[0].uuid;
    }
    
    async on_receive(message, from) {
        //console.log('receive:', {message, from});
        switch(message.action) {
            case 'keep-alive':
                this.update_instances(message, from);
                break;
            case 'shutdown':
                this.remove_instance(from);
                break;
            case 'subscribe-db-event': 
                if (from !== this.uuid) {
                    this.subscribe_lifecycle_events(message.uid, false);
                }
                break;
            case 'evict-local-cache': 
                this.evict_local_cache(message, from)
                break;
            case 'upsert':
                await this.on_db_upsert(message);
                break;
            case 'delete': 
                await this.on_db_delete(message);
                break;
            default:
                console.log(`unknown action ${message.action}`);
        }
    }

    evict_local_cache({keys}, from) {
        if (from !== this.uuid && keys && keys.length > 0) {
            for (const key of keys) this.app.local_cache.delete(key);
        }
    }

    async on_db_upsert(message) {
        const {uid, data} = message;
        if (uid && data) {
            if (uid === config_uid) {
                this.app.update_config(data);
            } else if (data.id) {
                await this.evict_dependent(uid, data.id);
            }
        } else {
            console.error('unknown upsert message', JSON.stringify(message));
        }
    }

    async on_db_delete(message) {
        const {uid, data} = message;
        if (uid && data) {
            if ([config_uid, handle_uid].includes(uid)) {
                this.app.del_config(data.name, handle_uid === uid);
            } else {
                await this.evict_dependent(uid, data.id);
            }
        } else {
            console.error('unknown delete message', JSON.stringify(message));
        }
    }

    update_instances(message, from) {

        let instance = {uuid: from, timestamp: message.timestamp};

        if (this.instances.length > 0) {
            if (this.instances.find(x => x.uuid === from)) {
                instance = null;
            } else {
                for (let i = 0; i < this.instances.length; i++) {
                    const { uuid, timestamp } = this.instances[i];
                    if (instance.timestamp < timestamp) {
                        this.instances.splice(i, 0, instance);
                        instance = null;
                    } else if (instance.timestamp === timestamp && from > uuid) {
                        this.instances.splice(i, 0, instance);
                        instance = null;
                    }
                }
            }
        }
        if (instance) this.instances.push(instance);
    }

    remove_instance(uuid) {
        const index = this.instances.findIndex(x => x.uuid === uuid);
        if (index !== -1) this.instances.splice(index, 1);
    }

    async evict_dependent(uid, id) {
        const key = get_dependency_key({uid, id});
        const keys = await this.redis_cache.get_dependencies(key);
        if (keys.length === 0) return;
        for (const key of keys) {
            const cacheable = new Cacheable({key});
            await cacheable.del(this.local_cache, this.redis_cache);
        }
        this.publish({action: 'evict-local-cache', keys})
    }

    subscribe_lifecycle_events(uid, publish = true) {

        if (!this.app.strapi) return;

        if (!uid || this.subscribed_uids.includes(uid)) return;

        this.subscribed_uids.push(uid);
        
        if (publish) this.publish({uid, action: 'subscribe-db-event'});
        
        console.log('subscribe_lifecycle_events', uid);
        
        this.app.strapi.db.lifecycles.subscribe(helpers.lifecycles(this.app, uid))
    }
}

module.exports = Servers;