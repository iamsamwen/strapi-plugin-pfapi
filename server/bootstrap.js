'use strict';

const { PfapiApp } = require('./pfapi');

module.exports = async ({ strapi }) => {
  await new PfapiApp(strapi).start();
};
