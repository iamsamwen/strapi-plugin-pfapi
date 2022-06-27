'use strict';

const util = require('util');
const { Refreshable } = require('./');

class FindOne extends Refreshable {

    reduce(params) {
        if (process.env.DEBUG) {
            console.log('FindOne reduce', util.inspect(params, false, null, true));
        }
        let {uid, fields, filters, populate} = params;
        return {uid, fields, filters, populate, limit: 1}
    }

    async get_data({uid, id, ...params}) {
        if (process.env.DEBUG) {
            console.log('FindOne get_data', uid,  util.inspect(params, false, null, true));
        }
        if (!uid) return null;
        let data = await strapi.entityService.findMany(uid, params);
        if (data.length === 0) return null;
        data = data[0];
        const dependencies = [{uid, id: data.id}];
        return {data, dependencies};
    }
}

module.exports = new FindOne(__filename);