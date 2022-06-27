module.exports = [
  {
    method: 'GET',
    path: '/compose/:handle',
    handler: 'pfapiController.getCompose',
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
