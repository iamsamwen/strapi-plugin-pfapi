'use strict';

const { Refreshable } = require('strapi-pfapi');

class GetParams extends Refreshable {

    async get_data(params) {
        return {data: params};
    }
}

module.exports = new GetParams(__filename);