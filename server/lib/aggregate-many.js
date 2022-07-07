'use strict';

const { Composite, get_pagination, logging } = require('./');

const find_many = require('./find-many');
const get_count = require('./get-count');
const run_ejs = require('./run-ejs');

class AggregateMany extends Composite {

    items = find_many;

    total = get_count;

    transform(data, params) {
        logging.debug('AggregateMany transform', params);
        const total = data.total;
        data.pagination = get_pagination({...params, total });
        if (params.sort) data.sort = params.sort;
        run_ejs(data);
        delete data.total;
    }
}

module.exports = new AggregateMany();