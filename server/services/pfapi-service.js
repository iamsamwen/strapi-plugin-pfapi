'use strict';

const get_params = require('./get-params');
const find_one = require('./find-one');
const find_many = require('./find-many');
const get_count = require('./get-count');

module.exports = ({ strapi }) => ({
    async getParams(ctx) {
        await strapi.PfapiApp.handle_request(ctx, get_params);
    },
    async findOne(ctx) {
        await strapi.PfapiApp.handle_request(ctx, find_one);
    },
    async findMany(ctx) {
        await strapi.PfapiApp.handle_request(ctx, find_many);
    },
    async getCount(ctx) {
        await strapi.PfapiApp.handle_request(ctx, get_count);
    }
});