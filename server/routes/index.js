module.exports = [
  {
    method: 'GET',
    path: '/:handle',
    handler: 'pfapiController.findMany',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/:handle/count',
    handler: 'pfapiController.getCount',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/:handle/aggregate',
    handler: 'pfapiController.aggregateMany',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/:handle/aggregate/:id',
    handler: 'pfapiController.aggregateOne',
    config: {
      auth: false,
      policies: [],
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
