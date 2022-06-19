'use strict';

const util = require('util');

module.exports = {

    async afterUpdate(event) {
        console.log('*** pfapi-config afterUpdate', util.inspect(event, false, null, true));
        strapi.PfapiApp.after_update(strapi.PfapiApp.config_uid, event, (x) => x.result.publishedAt && x.params.data.name ? x.params.data : null);
    },

    async afterDelete(event) {
        console.log('*** pfapi-config afterDelete', util.inspect(event, false, null, true));
        strapi.PfapiApp.after_delete(strapi.PfapiApp.config_uid, event);
    },

};
