'use strict';

const { Refreshable, get_start_limit, logging, run_group_by } = require('./');

class FindMany extends Refreshable {

    reduce(params) {
        logging.debug('FindMany reduce', params);
        const {uid, fields, filters, sort, populate, groupBy, publicationState, locale, delay, ...rest} = params;
        const {start, limit} = get_start_limit(rest);
        return {uid, fields, filters, sort, populate, groupBy, publicationState, locale, delay, start, limit}
    }

    async get_data({uid, groupBy, delay, ...params}) {
        logging.debug('FindMany get_data', params);
        if (!uid) return null;
        const data = groupBy ? 
            await run_group_by(uid, groupBy, params) : 
            await strapi.entityService.findMany(uid, params);
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