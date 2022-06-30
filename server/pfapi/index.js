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
        super(strapi, default_config, config_uid, handle_uid);
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

    async initialize_data() {
        const data = {key: this.constructor.name, data: require('./default-config')};
        await this.strapi.db.query(this.config_uid).create({data});
    }
}

module.exports.PfapiApp = PfapiApp;
