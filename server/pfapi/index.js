'use strict';

//const pfapi = require('/Users/sam/iamsamwen/strapi-pfapi/src');
const pfapi = require('strapi-pfapi');

module.exports = {
    ...pfapi
}

const { AppBase, RedisCache, LocalCache, RefreshQueue, ExpiresWatch, get_params, get_config_key } = module.exports;

const default_config = require('./default-config');

const helpers = require('./helpers');

const config_uid = helpers.config_uid;
const handle_uid = helpers.handle_uid;

const Servers = require('./servers');
const HttpThrottle = require('./http-throttle');

class PfapiApp extends AppBase {

    constructor(strapi) {

        super();

        this.strapi = strapi;
        this.run_maintenance_interval = 10000;
        this.config = default_config;
    }

    get local_cache() {
        return this._local_cache;
    }

    get redis_cache() {
        return this._redis_cache;
    }

    async start() {
        
        Object.assign(this.config, await helpers.fetch_config(this.strapi, this.constructor.name));
    
        this._local_cache = new LocalCache(await helpers.fetch_config(this.strapi, 'LocalCache'));
        this._redis_cache = new RedisCache(process.env.REDIS_URI);

        this.throttle = new HttpThrottle(this);

        await this.update_configs();
    
        this.servers = new Servers(this);
        await this.servers.start();

        if (this.strapi) this.strapi.PfapiApp = this;

        this.run_maintenance();
    }

    subscribe_lifecycle_events(uid, publish = true) {
        this.servers.subscribe_lifecycle_events(uid, publish);
    }

    get_params(ctx) {
        const params = get_params(ctx);        
        if (params.handle) {
            const uid = helpers.get_api_uid(this.strapi, this.local_cache, params.handle);
            if (uid) params.uid = uid;
        }
        return params;
    }

    is_blocked(ctx) {
        const block_ips_list = this.config.block_ips_list;
        return helpers.is_ip_matched(ctx, block_ips_list);
    }

    is_throttled(ctx) {
        return this.throttle.is_throttled(ctx);
    }    

    is_auth(ctx, {api_key, uid}) {
        if (this.config.api_keys) {
            if (!api_key) return false;
            const api_info = this.config.api_keys[api_key];
            if (api_info) {
                if (this.config.allowed_uids) {
                    return this.config.allowed_uids.includes(uid);
                }
                return true;
            }
            return false;
        } else {
            if (this.config.allowed_uids) {
                return this.config.allowed_uids.includes(uid);
            }
            return true;
        }
    }

    after_upsert(event) {
        const uid = event.model.uid;
        if (!event.result.hasOwnProperty('publishedAt') || event.result.publishedAt) {
            this.servers.publish({uid, action: 'upsert', data: event.result});
        } else if (event.params.data.publishedAt === null) {
            this.servers.publish({uid, action: 'delete', data: event.result});
        }
    }

    after_delete(event) {
        const uid = event.model.uid;
        if (!event.result.hasOwnProperty('publishedAt') || event.result.publishedAt) {
            this.servers.publish({uid, action: 'delete', data: event.result});
        }
    }


    run_maintenance() {

        this.started_at = Date.now();;

        this.servers.publish({action: 'keep-alive', now_ms: this.started_at});

        this.subscribe_lifecycle_events(config_uid, false);
        this.subscribe_lifecycle_events(handle_uid, false);

        this.update_timer = setInterval(async () => {

            const now_ms = Date.now();

            await this.servers.publish({action: 'keep-alive', timestamp: this.started_at, now_ms});

            const instances = this.servers.instances;

            for (let i = 0; i < instances; i++) {
                const { timestamp } = this.instances[i];
                if (now_ms - timestamp > 3 * this.run_maintenance_interval) {
                    instances.splice(i, 1);
                }
            }

            if (now_ms - this.started_at > this.run_maintenance_interval * 3) {
                if (this.servers.is_primary()) {
                    if (!this.refresh_queue) await this.start_refresh_queue()
                } else {
                    if (this.refresh_queue) await this.stop_refresh_queue();
                }
            }

            const { config_update_interval } = this.config;
            if (config_update_interval && (!this.update_at || now_ms - this.update_at.getTime() > config_update_interval)) {
                await this.update_configs();
            }

        }, this.run_maintenance_interval);

    }

    async start_refresh_queue() {
        console.log('start expires watch/refresh', this.servers.uuid);
        this.refresh_queue = new RefreshQueue(this.redis_cache, this.local_cache);
        await this.refresh_queue.start();
        this.expires_watch = new ExpiresWatch(this.redis_cache, this.refresh_queue);
        await this.expires_watch.start();
    }

    async stop_refresh_queue() {
        console.log('stop expires watch/refresh', this.servers.uuid)
        await this.expires_watch.stop();
        this.expires_watch = null;
        await this.refresh_queue.stop();
        this.refresh_queue = null;
    }

    async stop() {

        await this.servers.publish({action: 'shutdown'});

        if (this.update_timer) {
            clearInterval(this.update_timer);
            this.update_timer = null;
        }
        if (this.servers) {
            await this.servers.stop();
        }
        if (this.local_invalidate) {
            await this.local_invalidate.stop();
        }
        if (this.refresh_queue) {
            await this.refresh_queue.stop();
        }
        if (this.throttle) {
            await this.throttle.stop();
        }
        this.local_cache.stop();
        await this.redis_cache.close();

    }

    del_config(key, is_handle) {

        if (!this.local_cache || !key) return false;

        const cache_key = get_config_key(key, is_handle);
        this.local_cache.delete(cache_key);

        if (key === this.constructor.name) {
            this.config = default_config;
            this.apply_config();
        }
    }

    update_config(item) {
        if (!this.local_cache || !item) return false;
        const key = helpers.get_item_config_key(item);
        if (!key) return false;
        const data = helpers.normalize_data(item);
        //console.log(item.key || item.handle, key, data);
        if (item.key === this.constructor.name) {
            Object.assign(this.config, data);
            this.apply_config();
            return true;
        }
        return this.local_cache.put(key, data, true);
    }

    apply_config() {
        this.strapi.app.proxy = !!this.config.proxy;
        this.throttle.apply_rate_limits(this.config.rate_limits)
    }

    async update_configs() {

        if (!this.strapi) return;

        const query = {where: {}};
        if (this.updated_at) query.where.updatedAt = {$gt: this.updated_at};

        let now = new Date();

        const items1 = await this.strapi.query(config_uid).findMany(query);
        const items2 = await this.strapi.query(handle_uid).findMany(query);

        const items = [...items1, ...items2];
        if (items.length > 0) {
            for (const item of items) this.update_config(item);
        } else if (!this.updated_at) {
            await helpers.initialize_data(this);
            now = new Date();
        }

        this.updated_at = now;    
    }

}

module.exports.PfapiApp = PfapiApp;
