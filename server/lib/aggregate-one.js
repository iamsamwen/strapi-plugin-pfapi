'use strict';

const { Composite, logging } = require('./');

const find_one = require('./find-one');

class AggregateOne extends Composite {

    item = find_one;

    transform(data, params) {
        logging.debug('AggregateOne transform', params);
    }
}

module.exports = new AggregateOne();