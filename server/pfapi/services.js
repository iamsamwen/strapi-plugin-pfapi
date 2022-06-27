'use strict';

const find_one = require('./find-one');
const find_many = require('./find-many');
const get_count = require('./get-count');
const aggregate_many = require('./aggregate-many');
const aggregate_one = require('./aggregate-one');

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
    async aggregateOne(ctx) {
        await strapi.PfapiApp.handle(ctx, aggregate_one);
    },
    async aggregateMany(ctx) {
        await strapi.PfapiApp.handle(ctx, aggregate_many);
    },
});