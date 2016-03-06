module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (e.g. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'browserify'],

        // For info about the files array for watching:
        //   http://karma-runner.github.io/0.13/config/files.html
        files: [
            // These files are probably going to be included in
            // all our tests that we'd write. The files object in
            // each individual karma target are added to these.

            // TODO refactor out the complex require in tests
            { pattern: 'node_modules/chai/chai.js', watched: false },
            { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', watched: false },
            { pattern: 'node_modules/sinon/pkg/sinon.js', watched: false },

            // Test files
            'test/**/spec.*.js',

            // Watch the source files
            {pattern: 'src/client/js/*.js', watched: true, served: false, included: false},

            // html2js preprocessor takes this file and converts it
            // to a string in our JS when the tests run.
            {pattern: 'test/integration/fixtures/index.html',  watched: true, served: false}
        ],

        exclude: ['test/coverage/**/*', '*bundle*', '*browserify'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.js': ['browserify']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9877,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: [],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        //singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        browserify: {
            debug: true
        },
        // https://www.npmjs.com/package/karma-browserify#transforms
        //    transform: [ 'reactify', 'coffeeify', 'brfs' ]
        //    // don't forget to register the extensions
        //    extensions: ['.js', '.jsx', '.coffee']

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: 1

    });
};