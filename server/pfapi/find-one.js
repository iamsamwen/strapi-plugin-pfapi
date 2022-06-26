'use strict';

const util = require('util');
const { Refreshable } = require('./');

class FindOne extends Refreshable {

    reduce(params) {
        if (process.env.DEBUG) {
            console.log('FindOne reduce', util.inspect(params, false, null, true));
        }
        const {uid, id, fields, populate} = params;
        return {uid, id, fields, populate}
    }

    async get_data({uid, id, ...params}) {
        if (process.env.DEBUG) {
            console.log('FindOne get_data', uid, id, util.inspect(params, false, null, true));
        }
        if (!uid) return null;
        const data = await strapi.entityService.findOne(uid, id, params);
        const dependencies = [{uid, id}];
        return {data, dependencies};
    }
}

module.exports = new FindOne(__filename);