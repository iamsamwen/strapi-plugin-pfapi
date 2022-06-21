'use strict';

const { Refreshable } = require('../pfapi');

class GetCount extends Refreshable {

    reduce({uid, filters}) {
        return {uid, filters}
    }

    async get_data({uid, ...params}) {
        //console.log('GetCount', uid, params);
        const data = await strapi.entityService.count(uid, params);
        const dependencies = [{uid}]
        return {data, dependencies};
    }
}

module.exports = new GetCount(__filename);