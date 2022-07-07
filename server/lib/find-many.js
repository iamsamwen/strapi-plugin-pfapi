'use strict';

const { Refreshable, get_start_limit, logging } = require('./');

class FindMany extends Refreshable {

    reduce(params) {
        logging.debug('FindMany reduce', params);
        const {uid, fields, filters, sort, populate, delay, ...rest} = params;
        const {start, limit} = get_start_limit(rest);
        return {uid, fields, filters, sort, populate, delay, start, limit}
    }

    async get_data({uid, delay, ...params}) {
        logging.debug('FindMany get_data', params);
        if (!uid) return null;
        const data = await strapi.entityService.findMany(uid, params);
        const dependencies = [];
        for (const {id} of data) {
            dependencies.push({uid, id});
        }
        if (delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return {data, dependencies};
    }
}

module.exports = new FindMany(__filename);