'use strict';

const { Refreshable, logging, run_filters } = require('./');

class GetFilters extends Refreshable {

    reduce(params) {
        logging.debug('GetFilters reduce', params);
        const {uid, fields, filters, sort, populate, publicationState, locale, filters_config, delay} = params;
        return {uid, fields, filters, sort, populate, publicationState, locale, filters_config, delay}
    }

    async get_data(params) {
        logging.debug('GetFilters get_data', params);
        const {uid, filters_config, delay, ...rest} = params;
        if (!uid) return null;
        const data = await run_filters(uid, filters_config, rest);
        const dependencies = [{uid}];
        if (delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return { data, dependencies };
    }
}

module.exports = new GetFilters(__filename);