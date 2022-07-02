'use strict';

const pfapiState = require('./pfapi-state');
const pfapiConfig = require('./pfapi-config');
const pfapiHandle = require('./pfapi-handle');

const pfapiIp = require('./pfapi-ip');
const pfapiKey = require('./pfapi-key');
const pfapiRateLimit = require('./pfapi-rate-limit');

module.exports = {
    'pfapi-state': pfapiState,
    'pfapi-config': pfapiConfig,
    'pfapi-handle': pfapiHandle,

    'pfapi-ip': pfapiIp,
    'pfapi-key': pfapiKey,
    'pfapi-rate-limit': pfapiRateLimit,
};
