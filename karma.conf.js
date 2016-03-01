module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (e.g. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'browserify'],

        // list of files / patterns to load in the browser
        //files: ['test/**/*.js'],

        // list of files to exclude
        //exclude: ['test/coverage/'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.js': ['browserify'],
            'test/**/*.html': ['html2js'],
            'src/client/js/*.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

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
        logLevel: 'LOG_DEBUG',

        browserify: {
            debug: true
        },
        // https://www.npmjs.com/package/karma-browserify#transforms
        //    transform: [ 'reactify', 'coffeeify', 'brfs' ]
        //    // don't forget to register the extensions
        //    extensions: ['.js', '.jsx', '.coffee']

        coverageReporter: {
            dir: 'test/coverage',
            // Force the use of the Istanbul instrumenter to cover files
            instrumenter: {
                'src/client/js/*.js': ['istanbul']
            },
            reporters: [
                // reporters not supporting the `file` property
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' }
            ]
        },

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity

    });
};