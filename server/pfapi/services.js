'use strict';

const find_one = require('./find-one');
const find_many = require('./find-many');
const get_count = require('./get-count');
const get_compose = require('./get-compose');

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
    async getCompose(ctx) {
        await strapi.PfapiApp.handle(ctx, get_compose);
    },
});