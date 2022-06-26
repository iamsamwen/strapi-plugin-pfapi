'use strict';

const { Throttle } = require('./');
const { is_ip_matched } = require('./helpers');

class HttpThrottle extends Throttle {

    constructor(app) {
        super(app.redis_cache, app.local_cache);
        this.app = app;
        if (app.config.rate_limits) {
            this.apply_rate_limits(app.config.rate_limits);
        }
    }

    get_signature(ctx) {
        const white_ips_list = this.app.config.white_ips_list;
        if (is_ip_matched(ctx, white_ips_list)) {
            return null;
        }
        return {ip};
    }
}

module.exports = HttpThrottle;