'use strict';

const { Refreshable, logging, run_group_by_count } = require('./');

class GetCount extends Refreshable {

    reduce(params) {
        logging.debug('GetCount reduce', params);
        const {uid, filters, groupBy, publicationState, delay} = params;
        return {uid, filters, groupBy, publicationState, delay}
    }

    async get_data({uid, groupBy, delay, ...params}) {
        logging.debug('GetCount get_data', uid, params);
        if (!uid) return null;
        const data = groupBy ? 
            await run_group_by_count(uid, groupBy, params) :
            await strapi.entityService.count(uid, params);
        const dependencies = [{uid}];
        if (delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return {data, dependencies};
    }
}

module.exports = new GetCount(__filename);