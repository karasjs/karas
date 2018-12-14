const config = require('./webpack.config');

module.exports = Object.assign(config, {
  watch: true,
  mode: 'development',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
});
