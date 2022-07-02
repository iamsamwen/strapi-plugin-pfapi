module.exports = [
  /**
   * routes available for development and debug
   */
  {
    method: 'GET',
    path: '/cache/:type/:key',
    handler: 'pfapiController.handleCacheRequest',
    config: {
      auth: false
    },
  },
  /**
   * routes for pfapi
   */
  {
    method: 'GET',
    path: '/:handle',
    handler: 'pfapiController.findMany',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/:handle/count',
    handler: 'pfapiController.getCount',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/:handle/aggregate',
    handler: 'pfapiController.aggregateMany',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/:handle/aggregate/:id',
    handler: 'pfapiController.aggregateOne',
    config: {
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/:handle/:id',
    handler: 'pfapiController.findOne',
    config: {
      auth: false,
      policies: [],
    },
  },
];
