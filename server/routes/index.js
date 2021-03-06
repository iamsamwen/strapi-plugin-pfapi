'use strict';

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
   * retrieve routes for pfapi
   */
   {
    method: 'GET',
    path: '/filters/:handle',
    handler: 'pfapiController.getFilters',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/pf/:handle',
    handler: 'pfapiController.aggregateMany',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/pf/:handle/:id',
    handler: 'pfapiController.aggregateOne',
    config: {
      auth: false
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
     path: '/:handle/:id',
     handler: 'pfapiController.findOne',
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
    },
  }
  
];
