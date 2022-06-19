'use strict';

module.exports = async ({ strapi }) => {
  await strapi.PfapiApp.stop();
};
