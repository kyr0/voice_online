var istanbul = require("browserify-istanbul");

module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-webpack');
    var webpack = require('webpack');
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        watch: {
            static: {
                files: ['./src/client/js/drawLesson.js'],
                tasks: ['shell:cp_static']
            },
            python: {
                files: ['../source/**/*.py'],
                tasks: ['shell:be_test']
            }
        },

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
                    path: "../source/lesson/static/js/",
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
                    path: "../source/lesson/static/js/",
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
            }
        },

        shell: {
            be_test: {
                // NOTE: when tox has multiple test configs, switch to `command: tox`, simple no options necessary
                command: [
                    'source ../.tox/py34-postgresql/bin/activate',
                    'python manage.py test'
                ].join('&&'),
                options: {
                    execOptions: {
                        cwd: '../source'
                    }
                }
            },
            runserver: {
                command: [
                    'source ../.tox/py34-postgresql/bin/activate',
                    'python manage.py runserver'
                ].join('&&'),
                options: {
                    execOptions: {
                        cwd: '../source'
                    }
                }
            },
            cp_static: {  // note that this is not responsible for bundles which are placed in BE by webpack
                // TODO manage bundles here
                command: [
                    'set -x',  // make the commands echo to stdout
                    'mkdir -p ../source/lesson/static/js',
                    'cp ./src/client/js/drawLesson.js ../source/lesson/static/js/',
                    'cp ./src/dependencies/paper-full.min.js ../source/lesson/static/js/'
                ].join('&&')
            }
        },

        concurrent: {
            runserver: {
                tasks: ['shell:runserver'],
                options: {
                    logConcurrentOutput: true
                }
            },
            dev: {
                tasks: ['shell:runserver', 'karma:dev', 'webpack', 'watch:python', 'watch:static'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('coverage', ['karma:coverage']);
    grunt.registerTask('build', ['webpack:build', 'shell:cp_static']);
    grunt.registerTask('test', ['karma:once', 'shell:be_test']);
    grunt.registerTask('staging', ['webpack:build']);

};