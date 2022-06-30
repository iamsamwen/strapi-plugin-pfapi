'use strict';

const { PfapiApp } = require('./pfapi');

module.exports = async ({ strapi }) => {
  const pfapi = new PfapiApp(strapi);
  await pfapi.start();
};
