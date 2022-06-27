'use strict';

module.exports = {
  async findOne(ctx) {
    const service = strapi.plugin('pfapi').service('PfapiService');
    await service.findOne(ctx);
  },
  async findMany(ctx) {
    const service = strapi.plugin('pfapi').service('PfapiService');
    await service.findMany(ctx);
  },
  async getCount(ctx) {
    const service = strapi.plugin('pfapi').service('PfapiService');
    await service.getCount(ctx);
  },
  async aggregateMany(ctx) {
    const service = strapi.plugin('pfapi').service('PfapiService');
    await service.aggregateMany(ctx);
  },
  async aggregateOne(ctx) {
    const service = strapi.plugin('pfapi').service('PfapiService');
    await service.aggregateOne(ctx);
  },
};
