var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8081/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    proxy: {
      '/system*': {target: 'http://10.200.0.182/', secure: false},
      '/marathon*': {target: 'http://10.200.0.182/', secure: false},
      '/dcos-history-service*': {target: 'http://10.200.0.182/', secure: false},
      '/package*': {target: 'http://10.200.0.182/', secure: false}
    }
  }
});
