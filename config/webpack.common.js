var webpack = require('webpack');

var CopyWebpackPlugin = (CopyWebpackPlugin = require('copy-webpack-plugin'), CopyWebpackPlugin.default || CopyWebpackPlugin);
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var SassLintPlugin = require('sasslint-webpack-plugin');

var fs = require('fs');

var loadAsString = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.svg'] = loadAsString;
require.extensions['.css'] = loadAsString;

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'frameworks': './src/frameworks.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['', '.js', '.ts']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      },
      {
        test: /\.scss$/,
        exclude: '/node_modules/',
        loaders: ['raw-loader', 'sass-loader', 'sass?sourceMap']
      }
    ]
  },

  plugins: [
    new SassLintPlugin({
      glob: 'src/**/*.scss'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'frameworks', 'polyfills']
    }),
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }]),
    new HtmlWebpackPlugin({
      include: _ => require(`${__dirname}/../src/${_}`),
      template: 'src/index.ejs',
    })
  ]
};
