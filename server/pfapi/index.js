'use strict';

//const pfapi = require('/Users/sam/iamsamwen/strapi-pfapi/src');
const pfapi = require('strapi-pfapi');

module.exports = {
    ...pfapi
}

const { AppBase, is_ip_matched } = module.exports;

const default_config = require('./default-config');

const config_uid = 'plugin::pfapi.pfapi-config';
const handle_uid = 'plugin::pfapi.pfapi-handle';

class PfapiApp extends AppBase {

    constructor(strapi) {
        super(config_uid, handle_uid);
        this.strapi = strapi;
        this.config = default_config;
    }

    is_white_listed(ctx) {
        if (this.config.white_ips_list) {
            return is_ip_matched(ctx, this.app.config.white_ips_list);
        }
        return false;
    }

    is_blocked(ctx) {
        if (this.config.block_ips_list) {
            return is_ip_matched(ctx, this.config.block_ips_list);
        }
        return false;
    }

    throttle_pattern(ctx) {
        return {ip: ctx.ip};
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

    async update_configs() {

        if (!this.strapi) return;

        const items1 = await this.strapi.query(config_uid).findMany();
        const items2 = await this.strapi.query(handle_uid).findMany();

        const items = [...items1, ...items2];

        if (items.length > 0) {
            for (const item of items) this.update_config(item);
        } else {
            await this.initialize_data();
        }
    }

    async initialize_data() {
        await AppBase.prototype.initialize_data();
        const data = {key: this.constructor.name, data: require('./default-config')};
        await this.strapi.query(config_uid).createOne({data});
    }
}

module.exports.PfapiApp = PfapiApp;
