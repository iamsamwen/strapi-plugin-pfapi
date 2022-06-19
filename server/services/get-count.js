'use strict';

const { Refreshable } = require('strapi-pfapi');

class GetCount extends Refreshable {

    reduce({uid, filters}) {
        return {uid, filters}
    }

    async get_data({uid, ...params}) {
        //console.log(uid, params);
        const data = await strapi.entityService.count(uid, params);
        return {data};
    }
}

module.exports = new GetCount(__filename);