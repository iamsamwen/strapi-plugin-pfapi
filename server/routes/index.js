module.exports = [
  {
    method: 'GET',
    path: '/:model/find-one/:id',
    handler: 'pfapiController.findOne',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/:model/find-many',
    handler: 'pfapiController.findMany',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/:model/get-count',
    handler: 'pfapiController.getCount',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/:model/get-composite',
    handler: 'pfapiController.getComposite',
    config: {
      auth: false,
      policies: [],
    },
  },
];
