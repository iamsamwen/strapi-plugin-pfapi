'use strict';

const { Refreshable } = require('strapi-pfapi');

class FindMany extends Refreshable {

    reduce({uid, fields, filters, sort, populate}) {
        return {uid, fields, filters, sort, populate}
    }

    async get_data({uid, ...params}) {
        //console.log(uid, params);
        const data = await strapi.entityService.findMany(uid, params);
        return {data};
    }
}

module.exports = new FindMany(__filename);