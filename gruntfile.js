var istanbul = require("browserify-istanbul");

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        karma : {
            options: {
                configFile: 'karma.conf.js'
            },

            coverage: {
                preprocessors: {
                    'test/**/*.js': ['browserify'],
                    'src/client/**/*.js': ['coverage']
                },
                coverageReporter: {
                    dir : 'test/coverage/'
                },
                reporters: ['progress', 'coverage'],
                autoWatch: false,
                singleRun: true,
                browsers: ['PhantomJS'],
                browserify: {
                    debug: true,
                    transform: [
                        [
                            istanbul({
                                ignore: ["node_modules/**", "**/*.spec.js"],
                                includeUntested: false,
                                defaultIgnore: true
                            }),
                            { global: true }
                        ]
                    ]
                }
            },

            dev: {
                //browsers: ['Chrome', 'Firefox', 'PhantomJS']
                browsers: ['PhantomJS']
            },

            prod: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }

    });

    grunt.registerTask('default');

};