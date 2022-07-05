'use strict';

const fs = require('fs-extra');
const node_path =require('path');

module.exports = async (strapi) => {

    let root;
    
    if (strapi) {
        root = strapi.dirs.root;
    } else {
        let path = __dirname;
        let index = path.indexOf('node_modules');
        if (index !== -1) {
            root = path.slice(0, index - 1);
        } else {
            path = require.main.filename;
            index = path.indexOf('node_modules');
            if (index !== -1) {
                root = path.slice(0, index - 1);
            } else {
                const pfapi_path = '/src/plugins/pfapi/server/pfapi';
                if (__dirname.endsWith(pfapi_path)) {
                    root = __dirname.slice(0, __dirname.length - pfapi_path.length);
                } else {
                    console.log('strapi project root not found');
                    return;
                }
            }
        }
        
    }

    if (!fs.existsSync(node_path.join(root, 'src', 'admin'))) {
        console.log('not a strapi project root');
        return;
    }
    if (!fs.existsSync(node_path.join(root, 'src', 'api'))) {
        console.log('not a strapi project root');
        return;
    }

    const components_path = node_path.join(root, 'src', 'components');

    if (!fs.existsSync(components_path)) {
        fs.mkdirSync(components_path)
    }

    const pfapi_types_path = node_path.join(components_path, 'pfapi-types');
    if (!fs.existsSync(pfapi_types_path)) {
        await fs.copy(node_path.join(__dirname, 'pfapi-types'), pfapi_types_path);
        console.log('installed pfapi-types components');
    }
}