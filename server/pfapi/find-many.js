'use strict';

const util = require('util');
const { Refreshable, get_start_limit } = require('./');

class FindMany extends Refreshable {

    reduce(params) {
        if (process.env.DEBUG) {
            console.log('FindMany reduce', util.inspect(params, false, null, true));
        }
        const {uid, fields, filters, sort, populate, ...rest} = params;
        const {start, limit} = get_start_limit(rest);
        return {uid, fields, filters, sort, populate, start, limit}
    }

    async get_data({uid, ...params}) {
        if (process.env.DEBUG) {
            console.log('FindMany get_data', uid, util.inspect(params, false, null, true));
        }
        if (!uid) return null;
        const data = await strapi.entityService.findMany(uid, params);
        const dependencies = [];
        for (const {id} of data) {
            dependencies.push({uid, id});
        }
        return {data, dependencies};
    }
}

module.exports = new FindMany(__filename);