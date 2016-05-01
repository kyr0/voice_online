var istanbul = require("browserify-istanbul");

module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-webpack');
    var webpack = require('webpack');
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },

            coverage: {
                preprocessors: {
                    'test/**/*.js': ['browserify'],
                    'src/client/**/*.js': ['coverage']
                },
                coverageReporter: {
                    dir: 'test/coverage/'
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
                            {global: true}
                        ]
                    ]
                }
            },

            dev: {
                //browsers: ['Chrome', 'Firefox', 'PhantomJS']
                browsers: ['PhantomJS']
            },

            once: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        webpack: {
            dev: {
                // webpack options
                entry: "./src/client/js/main.js",
                output: {
                    path: "../source/lessons/static/js/",
                    filename: "[name].bundle.js"
                },
                resolve: {
                    modulesDirectories: ['node_modules']
                },
                stats: {
                    modules: false,
                    reasons: false,
                    version: false,
                    hash: false
                },
                progress: true,
                failOnError: false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue

                watch: true, // use webpacks watcher
                // You need to keep the grunt process alive

                keepalive: true // don't finish the grunt task
                // Use this in combination with the watch option

                //inline: true,  // embed the webpack-dev-server runtime into the bundle
                // Defaults to false

                //hot: true // adds the HotModuleReplacementPlugin and switch the server to hot mode
                // Use this in combination with the inline option
            },
            build: {
                // webpack options
                entry: "./src/client/js/main.js",
                output: {
                    path: "../source/lessons/static/js/",
                    filename: "[name].bundle.js"
                },
                plugins: [
                    // This plugin looks for similar chunks and files
                    // and merges them for better caching by the user
                    new webpack.optimize.DedupePlugin(),

                    // This plugins optimizes chunks and modules by
                    // how much they are used in your app
                    new webpack.optimize.OccurenceOrderPlugin(),

                    // This plugin prevents Webpack from creating chunks
                    // that would be too small to be worth loading separately
                    new webpack.optimize.MinChunkSizePlugin({
                        minChunkSize: 51200 // ~50kb
                    }),

                    new webpack.optimize.UglifyJsPlugin({
                        mangle: true,
                        sourceMap: true
                    })
                ],
                resolve: {
                    modulesDirectories: ['node_modules']
                },
                stats: {
                    modules: false,
                    reasons: false,
                    version: false,
                    hash: false
                },
                progress: true,
                failOnError: true
            },
        },

        concurrent: {
            dev: {
                tasks: ['karma:dev', 'webpack'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('coverage', ['karma:coverage']);
    grunt.registerTask('build', ['webpack:build', 'karma:once']);

};