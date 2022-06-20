'use strict';

const { Composite, get_pagination } = require('../pfapi');

const find_many = require('./find-many');
const get_count = require('./get-count');

class GetComposite extends Composite {

    //title = 'composite demo';
    
    items = find_many;

    total = get_count;

    transform(data, params) {
        //console.log('GetComposite', params);
        data.pagination = get_pagination({...params, total: data.total });
        delete data.total;
        if (params.sort) data.sort = params.sort;
    }
}

module.exports = new GetComposite();