'use strict';

const util = require('util');
const { Refreshable } = require('./');

class GetCount extends Refreshable {

    reduce(params) {
        if (process.env.DEBUG) {
            console.log('GetCount reduce', util.inspect(params, false, null, true));
        }
        const {uid, filters} = params;
        return {uid, filters}
    }

    async get_data({uid, ...params}) {
        if (process.env.DEBUG) {
            console.log('GetCount get_data', uid, util.inspect(params, false, null, true));
        }
        if (!uid) return null;
        const data = await strapi.entityService.count(uid, params);
        const dependencies = [{uid}]
        return {data, dependencies};
    }
}

module.exports = new GetCount(__filename);