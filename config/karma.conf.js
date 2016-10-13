var webpackConfig = require('./webpack.test');

module.exports = function(config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {pattern: './config/karma-test-shim.js', watched: false}
    ],

    preprocessors: {
      './config/karma-test-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['progress', 'junit', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,

    // the default configuration
    junitReporter: {
      outputDir: 'target/surefire-reports', // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: ''
    },

    //type: 'lcov' and comment file for html report
    coverageReporter: {
      type: 'lcovonly',
      dir: 'target/coverage',
      file: '../../lcovUT.info'
    }
  };

  config.set(_config);
};
