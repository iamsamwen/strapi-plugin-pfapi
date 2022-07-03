'use strict';

const pfapiState = require('./pfapi-state');
const pfapiHandle = require('./pfapi-handle');
const pfapiIp = require('./pfapi-ip');
const pfapiKey = require('./pfapi-key');
const pfapiRateLimit = require('./pfapi-rate-limit');

module.exports = {
    'pfapi-state': pfapiState,
    'pfapi-handle': pfapiHandle,
    'pfapi-ip': pfapiIp,
    'pfapi-key': pfapiKey,
    'pfapi-rate-limit': pfapiRateLimit,
};
