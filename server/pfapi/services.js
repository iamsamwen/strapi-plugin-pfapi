'use strict';

const find_one = require('./find-one');
const find_many = require('./find-many');
const get_count = require('./get-count');
const get_composite = require('./get-composite');

module.exports = ({ strapi }) => ({
    async findOne(ctx) {
        await strapi.PfapiApp.handle(ctx, find_one);
    },
    async findMany(ctx) {
        await strapi.PfapiApp.handle(ctx, find_many);
    },
    async getCount(ctx) {
        await strapi.PfapiApp.handle(ctx, get_count);
    },
    async getHandle(ctx) {
        await strapi.PfapiApp.handle(ctx, get_composite);
    },
});