'use strict';

//const pfapi = require('/Users/sam/iamsamwen/strapi-pfapi/src');
const pfapi = require('strapi-pfapi');

module.exports = {
    ...pfapi
}

const { AppBase, get_config_key, is_ip_matched, get_item_config_key, normalize_data } = module.exports;

const default_config = require('./default-config');

const config_uid = 'plugin::pfapi.pfapi-config';
const handle_uid = 'plugin::pfapi.pfapi-handle';

class PfapiApp extends AppBase {

    constructor(strapi) {
        super(config_uid, handle_uid);
        this.strapi = strapi;
        this.config = default_config;
    }

    is_blocked(ctx) {
        const block_ips_list = this.config.block_ips_list;
        return is_ip_matched(ctx, block_ips_list);
    }

    is_throttled(ctx) {
        if (!this.throttle) return false;
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
        const key = get_item_config_key(item);
        if (!key) return false;
        const data = normalize_data(item);
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
            await this.initialize_data();
            now = new Date();
        }

        this.updated_at = now;    
    }

    async initialize_data() {
        const entries = [];
        for (const [key, data] of Object.entries(default_configs)) {
            entries.push({key, data});
        }
        entries.push({key: this.constructor.name, data: require('./default-config')})
        if (entries.length > 0) {
            await this.strapi.query(config_uid).createMany({data: entries});
        }
    }
}

module.exports.PfapiApp = PfapiApp;
