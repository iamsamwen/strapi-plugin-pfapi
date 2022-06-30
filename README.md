# Strapi plugin pfapi

Pfapi plugin uses local and redis caches to achieve single digit milliseconds on average api response time.

## how to use

The plugin uses the strapi-pfapi library. With the world cities test data set provided by plugin strapi-plugin-pfapi-data, we can run a few API calls to demonstrate the idea.

### step 1 install redis server

Refer to: <a href="https://redis.io/docs/getting-started/">install redis server</a> on your local computer.

### step 2 create strapi app

```bash
yarn create strapi-app strapi-pfapi-app --quickstart 
```

after create and login your Strapi account from browser, stop the strapi server.

### step 3 install strapi-plugin-pfapi

```bash
cd strapi-pfapi-app

yarn add strapi-plugin-pfapi

yarn develop

```

stop the strapi server

### step 4 install strapi-plugin-pfapi-data

```bash

yarn add strapi-plugin-pfapi-data

yarn develop

```

![Admin Panel](https://github.com/iamsamwen/strapi-pfapi-plugin/blob/main/images/screen-shot1.png)

### step 5 test pfapi


### a) tests with world-cities as path variable

http://localhost:1337/pfapi/world-cities

http://localhost:1337/pfapi/world-cities/2148

### b) tests with config handle northern-cities as path variable

config data defined in PfapiHandles for handle **northern-cities**:

```json
{
    "handle": "northern-cities",
    "uid": "api::world-city.world-city",
    "attributes": {
        "title": "Northern Cities"
    },
    "params": {
        "filters": {
            "lat": {
                "$gt": 50
            }
        },
        "fields": [
            "name",
            "lat",
            "lng",
            "population"
        ]
    }
}
```

http://localhost:1337/pfapi/northern-cities

http://localhost:1337/pfapi/northern-cities/2148

http://localhost:1337/pfapi/northern-cities/aggregate

http://localhost:1337/pfapi/northern-cities/aggregate/2148

http://localhost:1337/pfapi/northern-city/aggregate/Anchorage

### c) tests with config handle northern-city with id_field is name

config data defined in PfapiHandles for handle **northern-city**:

```json
{
    "handle": "northern-city",
    "uid": "api::world-city.world-city",
    "attributes": {
        "title": "One Northern City"
    },
    "id_field": "name",
    "params": {
        "filters": {
            "lat": {
                "$gt": 50
            }
        },
        "fields": [
            "name",
            "lat",
            "lng",
            "population"
        ]
    }
}
```

http://localhost:1337/pfapi/northern-city/aggregate/Anchorage

### d) test data update

goto 

http://localhost:1337/admin/content-manager/collectionType/api::world-city.world-city/2148

make some change, for example: change population from 288000 to 288001

check APIs:

http://localhost:1337/pfapi/northern-cities/2148

http://localhost:1337/pfapi/northern-cities/aggregate/2148

http://localhost:1337/pfapi/northern-city/aggregate/Anchorage

to see if the cached data evicted and updated

### e) test config update

goto

http://localhost:1337/admin/content-manager/collectionType/plugin::pfapi.pfapi-handle/6

make some change, for example: remove iso3 from the fields array

check APIs:

http://localhost:1337/pfapi/northern-cities/2148

http://localhost:1337/pfapi/northern-cities/aggregate/2148