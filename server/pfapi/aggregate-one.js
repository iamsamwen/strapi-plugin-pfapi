'use strict';

const util = require('util');
const { Composite } = require('../pfapi');

const find_one = require('./find-one');

class AggregateOne extends Composite {

    item = find_one;

    transform(data, params) {
        if (process.env.DEBUG) {
            console.log('transform transform', util.inspect(params, false, null, true));
        }
    }
}

module.exports = new AggregateOne();