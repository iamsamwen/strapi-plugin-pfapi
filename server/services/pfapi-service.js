'use strict';

const find_one = require('./find-one');
const find_many = require('./find-many');
const get_count = require('./get-count');
const get_composite = require('./get-composite');

module.exports = ({ strapi }) => ({
    async findOne(ctx) {
        await strapi.PfapiApp.handle_request(ctx, find_one);
    },
    async findMany(ctx) {
        await strapi.PfapiApp.handle_request(ctx, find_many);
    },
    async getCount(ctx) {
        await strapi.PfapiApp.handle_request(ctx, get_count);
    },
    async getComposite(ctx) {
        await strapi.PfapiApp.handle_request(ctx, get_composite);
    },
});