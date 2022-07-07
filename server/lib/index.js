'use strict';

const fs = require('fs')

const pfapi_path = require('./pfapi-path')
const pfapi = pfapi_path && fs.existsSync(pfapi_path) ? require(pfapi_path) : require('strapi-pfapi');

module.exports = {
    ...pfapi
}