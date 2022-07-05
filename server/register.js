'use strict';

const install_types = require('./pfapi/install-types');

module.exports = async ({ strapi }) => {
    await install_types(strapi);
};
