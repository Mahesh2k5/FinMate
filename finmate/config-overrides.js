const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    util: require.resolve('util/'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    url: require.resolve('url/'),
    crypto: require.resolve('crypto-browserify'),
    assert: require.resolve('assert/')
  };

  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'process/browser': 'process/browser.js'
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};
