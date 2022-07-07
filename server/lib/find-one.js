'use strict';

const { Refreshable, logging } = require('./');

class FindOne extends Refreshable {

    reduce(params) {
        logging.debug('FindOne reduce', params);
        const {uid, fields, filters, populate, delay} = params;
        return {uid, fields, filters, populate, delay, limit: 1}
    }

    async get_data({uid, id, delay, ...params}) {
        logging.debug('FindOne get_data', uid, params);
        if (!uid) return null;
        let data = await strapi.entityService.findMany(uid, params);
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