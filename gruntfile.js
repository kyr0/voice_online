var path = require('path');

module.exports = function(grunt) {
    'use strict';

    var webpack = require('webpack');  // for plugins
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        watch: {
            // FROM KARMA ORIGINALLY
            // html2js preprocessor takes this file and converts it
            // to a string in our JS when the tests run.
            // {pattern: 'test/integration/fixtures/index.html',  watched: true, served: false}
            frontend: {
                files: [
                    './src/client/**/*.js*',
                    './test/**/*',
                    '!./test/**/static/js/*',
                    '!./test/**/index.html',
                    '!./src/client/js/drawLesson.js'
                ],
                // github.com/karma-runner/grunt-karma#karma-server-with-grunt-watch
                tasks: [
                    'webpack:dev',
                    'karma:dev:run' // NOTE the :run flag
                ]
            },
            static: {
                files: ['./src/client/js/drawLesson.js', './src/client/index.html'],
                tasks: ['shell:cp_static']
            },
            backend: {
                files: ['../source/**/*.py'],
                tasks: ['shell:be_test']
            }
        },

        karma: {
            options: {
                basePath: '',
                frameworks: ['mocha', 'chai'],
                autoWatch: false,
                singleRun: true,
                concurrency: 1,
                logLevel: 'INFO',
                colors: true,
                browsers: ['Chrome'],
                webpackMiddleware: {
                    noInfo: true
                }
            },
            dev: {
                preprocessors: {
                    'test/**/spec.*.js': ['webpack', 'sourcemap']
                },
                files: [
                    { src: 'test/**/spec.*.js' }
                ],
                exclude: ['test/coverage/**/*', '*bundle*'],
                reporters: ['progress'],
                background: true,
                singleRun: false
            },
            test: {
                preprocessors: {
                    'test/**/spec.*.js': ['webpack', 'sourcemap']
                },
                files: [
                    { src: 'test/**/spec.*.js' }
                ],
                exclude: ['test/coverage/**/*', '*bundle*'],
                reporters: ['progress']
            },
            coverage: {
                preprocessors: {
                    'test/**/*.js': ['webpack', 'sourcemap']
                },
                files: [
                    { src: 'test/**/spec.*.js' }
                ],
                coverageReporter: {
                    type: 'text'
                },
                reporters: ['progress', 'coverage'],
                browserNoActivityTimeout: 40000,
                webpack: {
                    module: {
                        postLoaders: [
                            {
                                test: /\.js$/,
                                include: path.resolve('src/client/'),
                                exclude: /(test|node_modules)\//,
                                loader: 'istanbul-instrumenter'
                            }
                        ]
                    }
                }
            },
        },

        webpack: {
            options: {
                // Legacy spike bundles from browserify, may be useful again when refactoring MPM
                // './spikes/paper/js/lesson.js -o ./spikes/paper/js/lesson.bundle.js',
                // './spikes/practice_tuner/js/tuner.js -o ./spikes/practice_tuner/js/tuner.bundle.js',
                // './spikes/canvas/scripts/canvas.js -o ./spikes/canvas/scripts/canvas.bundle.js',
                // './spikes/pitch/js/getBuffersFromTones.js -o ./spikes/pitch/js/getBuffersFromTones.bundle.js',
                // './spikes/pitch/js/drive_mpm.js -o ./spikes/pitch/js/drive_mpm.bundle.js',
                // './spikes/pitch/js/drive_webAudio.js -o ./spikes/pitch/js/drive_webAudio.bundle.js',

                entry: "./src/client/js/index.jsx",
                output: {
                    path: "./test/integration/fixtures/static/js/",
                    filename: "[name].bundle.js",
                    // serve your source maps from a server that is only accessible to your development team
                    // sourceMapFilename: "[name].bundle.js.map"
                },
                module: {
                    loaders: [
                        {
                            // Test for js or jsx files.
                            test: /\.jsx?$/,
                            exclude: /node_modules/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['es2015', 'react'],
                                cacheDirectory: true
                            }
                        }
                    ]
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
                progress: true
            },
            dev: {
                failOnError: false, // don't report error to grunt if webpack find errors
                devtool: "sourcemap",
                debug: true
            },
            build: {
                plugins: [
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.OccurenceOrderPlugin(),
                    new webpack.optimize.MinChunkSizePlugin({
                        minChunkSize: 51200 // ~50kb
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        mangle: true,
                    })
                ],
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
            killall: {
                // Just in case it is running, wasted lots of time on this
                command: [
                    'killall -9 node',
                    'killall -9 python'
                ].join(';'),
                options: { failOnError: false }
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
                command: [
                    'set -x',  // make the commands echo to stdout
                    'mkdir -p ../source/lesson/static/js',  // for dev server
                    'mkdir -p ./test/integration/fixtures/static/js',  // fixture for test suite
                    // for test suite
                    'cp ./src/client/index.html ./test/integration/fixtures/index.html',  // in 2 repos
                    'cp ./src/client/js/drawLesson.js ./test/integration/fixtures/static/js/',
                    'cp ./src/dependencies/paper-full.min.js ./test/integration/fixtures/static/js/',
                    // for dev
                    'cp ./src/client/index.html ../source/lesson/templates/paper.html',
                    'cp ./test/integration/fixtures/static/js/* ../source/lesson/static/js/'
                ].join('&&')
            }
        },

        concurrent: {
            dev: {
                tasks: ['shell:runserver', ['webpack:dev', 'karma:dev:start', 'watch']],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    grunt.registerTask('default', ['shell:killall', 'webpack:dev', 'shell:cp_static', 'karma:test', 'shell:be_test', 'concurrent:dev']);
    grunt.registerTask('coverage', ['karma:coverage']);
    grunt.registerTask('build', ['webpack:build', 'shell:cp_static']);
    grunt.registerTask('test', ['karma:test', 'shell:be_test']);

};