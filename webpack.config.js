const webpack = require('webpack');
const config = require('./webpack.base.config');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

config.entry = './src/index.js';
config.output = {
  path: path.resolve('dist'),
  filename: 'vue-json-edit.js',
  library: 'vue-json-edit',
  libraryTarget: 'umd',
};
config.externals = {
  vue: 'vue',
};

config.plugins = (config.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new UglifyJSPlugin({
  }),
]);
module.exports = config;
