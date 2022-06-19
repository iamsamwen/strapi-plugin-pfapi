'use strict';

const { Refreshable } = require('strapi-pfapi');

class FindOne extends Refreshable {

    reduce({uid, id, fields, populate}) {
        return {uid, id, fields, populate}
    }

    async get_data({uid, id, ...params}) {
        //console.log(uid, id, params);
        const data = await strapi.entityService.findOne(uid, id, params);
        return {data};
    }
}

module.exports = new FindOne(__filename);