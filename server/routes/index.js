module.exports = [
  {
    method: 'GET',
    path: '/handle/:handle',
    handler: 'pfapiController.getHandle',
    config: {
      auth: false,
      policies: [],
    },
  },
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
    path: '/:handle/:id',
    handler: 'pfapiController.findOne',
    config: {
      auth: false,
      policies: [],
    },
  },
];
