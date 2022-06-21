'use strict';

const { Refreshable, get_start_limit, get_pagination } = require('../pfapi');

class FindMany extends Refreshable {

    reduce({uid, fields, filters, sort, populate, ...rest}) {
        const {start, limit} = get_start_limit(rest);
        return {uid, fields, filters, sort, populate, start, limit}
    }

    async get_data({uid, ...params}) {
        //console.log('FindMany', uid, params);
        const data = await strapi.entityService.findMany(uid, params);
        const dependencies = [];
        for (const {id} of data) {
            dependencies.push({uid, id});
        }
        return {data, dependencies};
    }
}

module.exports = new FindMany(__filename);