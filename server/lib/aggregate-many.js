'use strict';

const { Composite, get_pagination, logging } = require('./');

const find_many = require('./find-many');
const get_count = require('./get-count');

class AggregateMany extends Composite {

    items = find_many;

    total = get_count;

    transform(data, params) {
        logging.debug('AggregateMany transform', params);
        data.pagination = get_pagination({...params, total: data.total });
        delete data.total;
        if (params.sort) data.sort = params.sort;
    }
}

module.exports = new AggregateMany();