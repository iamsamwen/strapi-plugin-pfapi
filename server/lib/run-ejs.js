'use strict';

const ejs = require('ejs');

module.exports = (object) => {
    for (const [key, value] of Object.entries(object)) {
        if (typeof value !== 'string') continue;
        if (!value.includes('<%') || !value.includes('%>')) continue;
        try {
            object[key] = ejs.render(value, object);
        } catch(err) {
            object[key] = err.message;
        }
    }
}