'use strict';

module.exports = {

    config_update_interval: 1800000,

    rate_limits: [
        { window_secs: 10, max_count: 1000, block_secs: 3600 },
    ],

    white_ips_list: [ '127.0.0.1' ],

    block_ips_list: [],

    proxy: true
}