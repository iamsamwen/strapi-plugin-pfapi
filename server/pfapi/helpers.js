'use strict';

const { matches } = require('ip-matching');


const { default_configs, get_config_key } = require('./');

const data_ignore_keys = [ 'id', 'key', 'handle', 'comment', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy' ];

const config_uid = 'plugin::pfapi.pfapi-config';
const handle_uid = 'plugin::pfapi.pfapi-handle';

module.exports = {

    config_uid,
    handle_uid,

    normalize_data,
    fetch_config,
    initialize_data,

    is_ip_matched,
    get_item_config_key,
    lifecycles,
    get_params_uid,
    update_params_with_id
};

function normalize_data({key, data = {}, ...rest}) {
    if (!rest || Object.keys(rest).length === 0) return data;
    for (const [k, v] of Object.entries(rest)) {
        if (v === null || data_ignore_keys.includes(k)) continue;
        data[k] = v;
    }
    return data;
}

async function fetch_config(strapi, key) {
    if (!strapi) return null;
    const result = await strapi.query(config_uid).findOne({where: { key }}) || {};
    return normalize_data(result);
}

async function initialize_data(app) {
    const entries = [];
    for (const [key, data] of Object.entries(default_configs)) {
        entries.push({key, data});
    }
    entries.push({key: app.constructor.name, data: require('./default-config')})
    if (entries.length > 0) {
        await app.strapi.query(config_uid).createMany({data: entries});
    }
    if (process.env.DEBUG) {
        const handles = require('./test-handles.json');
        await app.strapi.query(handle_uid).createMany({data: handles});
    }
}

function is_ip_matched(ctx, ips_list) {
    if (!ips_list || ips_list.length === 0) return false;
    const ip = ctx.request.ip;
    for (const list_ip of ips_list) {
        if (matches(ip, list_ip)) return true;
    }
    return false;
}

function get_item_config_key({key, handle} = {}) {
    if (key) return get_config_key(key, false);
    if (handle) return get_config_key(handle, true);
    return null;
}

function lifecycles(app, uid) {
    return {
        models: [uid],
        afterCreate(event) {
            app.after_upsert(event);
        },
        afterUpdate(event) {
            app.after_upsert(event);
        },
        afterDelete(event) {
            app.after_delete(event);
        },
    };
}

function get_params_uid(app, config, handle) {
    if (config && config.uid) {
        return config.uid;
    } else if (handle) {
        const cache_key = `api_uid::${handle}`;
        let uid = app.local_cache.get(cache_key);
        if (uid) {
            return uid;     
        } else {
            for (const [key, value] of Object.entries(app.strapi.contentTypes)) {
                if (!key.startsWith('api::')) continue;
                const {info: {pluralName}} = value;
                if (handle === pluralName) {
                    uid = key;
                    app.local_cache.put(cache_key, uid);
                    break;
                }
            }
            return uid;
        }
    }
}

function update_params_with_id(config, params, id) {
    const id_field = config && config.id_field ? config.id_field : 'id';
    if (params.filters) {
        if (params.filters.$and) params.filters.$and.push({[id_field]: id})
        else params.filters[id_field] = id;
    } else {
        params.filters = {[id_field]: id};
    }
}