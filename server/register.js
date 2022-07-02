'use strict';

const { install_types } = require('./pfapi');

module.exports = ({ strapi }) => {
    install_types(strapi);
};
