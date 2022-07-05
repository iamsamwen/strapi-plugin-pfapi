module.exports = ({ env }) => ({
  pfapi: {
    enabled: true,
    //resolve: './src/plugins/pfapi',
    config: {
      redis_uri: env('REDIS_URI'),
    }
  }
})
