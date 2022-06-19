'use strict';

const { PfapiApp } = require('strapi-pfapi');

module.exports = async ({ strapi }) => {
  const app = new PfapiApp(strapi, 'plugin::pfapi.pfapi-config');
  await app.start();
};
