'use strict';

const { Refreshable, logging, run_group_by } = require('./');

class FindOne extends Refreshable {

    reduce(params) {
        logging.debug('FindOne reduce', params);
        const {uid, fields, filters, populate, sort, groupBy, publicationState, locale, delay} = params;
        return {uid, fields, filters, populate, sort, groupBy, publicationState, locale, limit: 1, delay}
    }

    async get_data({uid, groupBy, delay, ...params}) {
        logging.debug('FindOne get_data', uid, params);
        if (!uid) return null;
        let data = groupBy ? 
            await run_group_by(uid, groupBy, params) : 
            await strapi.entityService.findMany(uid, params);
        if (data.length === 0) return null;
        data = data[0];
        const dependencies = [{uid, id: data.id}];
        if (delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return {data, dependencies};
    }
}

module.exports = new FindOne(__filename);