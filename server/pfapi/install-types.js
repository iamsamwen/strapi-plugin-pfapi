'use strict';

const fs = require('fs-extra');
const node_path =require('path');

module.exports = (strapi) => {

    const components_path = node_path.join(strapi.dirs.root, 'src', 'components');
    if (!fs.existsSync(components_path)) {
        fs.mkdirSync(components_path)
    }
    const pfapi_types_path = node_path.join(components_path, 'pfapi-types');
    if (!fs.existsSync(pfapi_types_path)) {
        fs.copySync(node_path.join(__dirname, 'pfapi-types'), pfapi_types_path);
        console.log('install components pfapi-types done!');
    }
}