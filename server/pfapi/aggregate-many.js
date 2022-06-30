'use strict';

const util = require('util');
const { Composite, get_pagination } = require('./');

const find_many = require('./find-many');
const get_count = require('./get-count');

class AggregateMany extends Composite {

    items = find_many;

    total = get_count;

    transform(data, params) {
        if (process.env.DEBUG) {
            console.log('AggregateMany transform', util.inspect(params, false, null, true));
        }
        data.pagination = get_pagination({...params, total: data.total });
        delete data.total;
        if (params.sort) data.sort = params.sort;
    }
}

module.exports = new AggregateMany();