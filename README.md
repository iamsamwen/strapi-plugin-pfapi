# Strapi plugin pfapi

Pfapi plugin provides configurable and fast API services. APIs are configurable through the admin panel with components and dynamic zone. Pfapi uses local and Redis caches to achieve single-digit milliseconds on average API response time.

![components and dynamic zone](https://github.com/iamsamwen/strapi-plugin-pfapi/blob/main/images/screen-shot2.png)

## how to use

The plugin uses the <a href="https://github.com/iamsamwen/strapi-pfapi">strapi-pfapi library</a>. With the world cities test data set provided by plugin strapi-plugin-pfapi-data, we can run a few API calls to demonstrate the idea.

### step 1 install redis server

Refer to: <a href="https://redis.io/docs/getting-started/">install redis server</a> on your local computer.

### step 2 create strapi app

```bash
yarn create strapi-app strapi-pfapi-app --quickstart 
```

after create and login your Strapi account from browser, stop the strapi server.

### step 3 install strapi-plugin-pfapi and strapi-plugin-pfapi-data

You don't have to install strapi-plugin-pfapi-data for your production.

strapi-plugin-pfapi-data provides a test data test for purpose of demo and test


```bash
cd strapi-pfapi-app

yarn add strapi-plugin-pfapi strapi-plugin-pfapi-data

yarn develop

```

![Admin Panel](https://github.com/iamsamwen/strapi-plugin-pfapi/blob/main/images/screen-shot1.png)

### step 4 setup api_key and permissions

get your api_key from:

http://localhost:1337/admin/content-manager/collectionType/plugin::pfapi.pfapi-key?page=1&pageSize=10&sort=key:ASC

A role with name PfapiDemo is installed in above steps.

Go to Settings > USERS & PERMISSIONS PLUGIN > Roles:

http://localhost:1337/admin/settings/users-permissions/roles

click on PfapiDemo,

Under Permissions > World-city

assign **find** and **findOne** permissions to PfapiDemo and click save.

OK, we are ready to run tests, please replace Pfapi-Demo-XXXXXXXX with your specific key or set your api_key to Pfapi-Demo-XXXXXXXX.

### step 5 demos && tests

### a) tests content-type name **world-cities** as path variable

http://localhost:1337/pfapi/world-cities?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/world-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

### b) tests config handle **northern-cities** as path variable

handle configs are defined in PfapiHandle.

***/pfapi***

http://localhost:1337/pfapi/northern-cities?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

***/pfapi/pf***

http://localhost:1337/pfapi/pf/northern-cities?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/pf/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX


### c) tests with config handle northern-city with id_field is name

config data defined in PfapiHandles for handle **northern-city**:

http://localhost:1337/pfapi/pf/northern-city/Anchorage?api_key=Pfapi-Demo-XXXXXXXX

### d) test data update

goto http://localhost:1337/admin/content-manager/collectionType/api::world-city.world-city/2148

make some change, for example: change population from 288000 to 288001

check APIs:

http://localhost:1337/pfapi/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/pf/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/pf/northern-city/Anchorage?api_key=Pfapi-Demo-XXXXXXXX

to see if the cached data evicted and updated

### e) test config update

goto http://localhost:1337/admin/content-manager/collectionType/plugin::pfapi.pfapi-handle/1

make some change, for example: add or remove country to the fields array

check APIs:

http://localhost:1337/pfapi/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/pf/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

## config redis uri

By default if it is not set, Pfapi uses redis://localhost/0.

You can set it to a different host and database number by providing **REDIS_URI** in plugins config file.

For redis cluster config, here is an example:

```
REDIS_URI=redis://172.31.23.70:6379,172.31.30.210:6379,172.31.22.214:6379/0

```

the plugins config file is located at config/plugins.js,

add following section:

```javascript
module.exports = ({ env }) => ({
  //...
  pfapi: {
    enabled: true,
    config: {
      redis_uri: env('REDIS_URI'),
    }
  }
  //...
})
```