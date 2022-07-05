'use strict';

const util = require('util');
const { Refreshable, logging } = require('./');

class GetCount extends Refreshable {

    reduce(params) {
        logging.debug('GetCount reduce', params);
        const {uid, filters, delay} = params;
        return {uid, filters, delay}
    }

    async get_data({uid, delay, ...params}) {
        logging.debug('GetCount get_data', uid, params);
        if (!uid) return null;
        const data = await strapi.entityService.count(uid, params);
        const dependencies = [{uid}]
        if (delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return {data, dependencies};
    }
}

module.exports = new GetCount(__filename);