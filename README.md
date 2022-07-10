# Strapi plugin pfapi

Pfapi plugin provides configurable, secure and fast API services. APIs are configurable through the admin panel with components and dynamic zone. Pfapi uses local and Redis caches to achieve single-digit milliseconds on average API response time. IP allow list, block list and Rate limits mechanisms are included and conveniently accessible.

Here are some test results for cached vs no cache:

|	 |test 1	|test 2	|test 3
|--|-------|-------|-------
|**cached** api response time	|4.95	|2.11	|1.86
|nocache api response time	|488	|493	|489
|cached total request time	|343	|273	|273
|nocache total request time	|955	|922	|927

![test results](https://github.com/iamsamwen/strapi-plugin-pfapi/blob/main/images/screen-shot4.png)

We can see pfapi plugin improves the api response time to 100 times faster. For detail, please read pfapi-tester section at bottom. 

## how to install

```bash
yarn add strapi-plugin-pfapi
```
## config Redis URI

By default, if it is not set, Pfapi uses redis://localhost/0.

You can set it to a different host and database number by providing **REDIS_URI** in the plugins config file.

For Redis cluster config, here is an example:

```bash
REDIS_URI=redis://172.31.23.70:6379,172.31.30.210:6379,172.31.22.214:6379/0
```

the plugins config file is located at:

config/plugins.js

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

## API parameters

The same <a href="https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/api-parameters.html">Strapi API parameters</a>: sort, filters, populate, fields, pagination and publicationState works for Pfapi.

## Security Defense

### 1) IP allow list and block list

**PfapiIp** conveniently provides access to IP allow list and block list mechanism. IPs in allow list will not check rate limits. IPs in block list will not have access to the prefix.

### 2) Rate limits for API calls

**PfapiRateLimit** provides access to the rate limits mechanism. rate limits can set with IP Mask and prefix.

*(it is not the same as the rate limits that come with strapi)*

Changes made to the two collections are effective immediately without restarting strapi servers.

Without enabling the defense middleware of pfapi plugin, the above mechanisms work only for Pfapi APIs.

To enable the defense middleware and cover all routes:

config/middlewares.js

```javascript
module.exports = [
  //...
  'plugin::pfapi.defense',
];
```

## EJS template for text and richtext component fields

We can use the EJS template to customize String fields in the api response JSON object.

For example:

In the northern-city handle,  Northern City - **<%= item.name %>** is the title

## How to use

![components and dynamic zone](https://github.com/iamsamwen/strapi-plugin-pfapi/blob/main/images/screen-shot2.png)

The plugin uses the <a href="https://github.com/iamsamwen/strapi-pfapi">strapi-pfapi library</a>. With the world cities test data set provided by plugin strapi-plugin-pfapi-data, we can run a few API calls to demonstrate the idea.

### step 1 install Redis server

Refer to: <a href="https://redis.io/docs/getting-started/">install redis server</a> on your local computer.

### step 2 create strapi app

```bash
yarn create strapi-app strapi-pfapi-app --quickstart 
```

After creating and logging into your Strapi account from the browser, stop the strapi server.

### step 3 install strapi-plugin-pfapi and strapi-plugin-pfapi-data

You don't have to install strapi-plugin-pfapi-data for your production.

strapi-plugin-pfapi-data provides a test data test for demo and test


```bash
cd strapi-pfapi-app

yarn add strapi-plugin-pfapi strapi-plugin-pfapi-data

yarn develop

```

![Admin Panel](https://github.com/iamsamwen/strapi-plugin-pfapi/blob/main/images/screen-shot1.png)

### step 4 setup api_key and permissions

get your api_key from:

http://localhost:1337/admin/content-manager/collectionType/plugin::pfapi.pfapi-key?page=1&pageSize=10&sort=key:ASC

A role with name PfapiDemo is installed in the above steps.

Go to Settings > USERS & PERMISSIONS PLUGIN > Roles:

![PfapiDemo](https://github.com/iamsamwen/strapi-plugin-pfapi/blob/main/images/screen-shot3.png)

http://localhost:1337/admin/settings/users-permissions/roles

click on PfapiDemo,

Under Permissions > World-city

assign **find** and **findOne** permissions to PfapiDemo and click save.

OK, we are ready to run tests, please replace Pfapi-Demo-XXXXXXXX with your specific key or set your api_key to Pfapi-Demo-XXXXXXXX.

### step 5 demos

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

***strapi api parameters***

http://localhost:1337/pfapi/northern-cities?filters[iso3]=USA&api_key=Pfapi-Demo-XXXXXXXX

### c) tests with config handle northern-city with id_field is name

config data defined in PfapiHandles for handle **northern-city**:

http://localhost:1337/pfapi/pf/northern-city/Anchorage?api_key=Pfapi-Demo-XXXXXXXX

### d) test data update

goto http://localhost:1337/admin/content-manager/collectionType/api::world-city.world-city/2148

make some change, for example: change the population from 288000 to 288001

check APIs:

http://localhost:1337/pfapi/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/pf/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/pf/northern-city/Anchorage?api_key=Pfapi-Demo-XXXXXXXX

to see if the cached data was evicted and updated

### e) test config update

goto http://localhost:1337/admin/content-manager/collectionType/plugin::pfapi.pfapi-handle/1

make some changes, for example: add or remove country to the fields array

check APIs:

http://localhost:1337/pfapi/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX

http://localhost:1337/pfapi/pf/northern-cities/2148?api_key=Pfapi-Demo-XXXXXXXX


## pfapi-tester

pfapi-tester is load tester for pfapi plugin. please refer to <a href="https://github.com/iamsamwen/pfapi-tester">pfapi-tester readme</a> for detail.

You can use it to test and verify pfapi plugin or your production system before launch.


