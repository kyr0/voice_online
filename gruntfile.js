var path = require('path');


module.exports = function(grunt) {
    'use strict';

    var webpack = require('webpack');  // for plugins
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        eslint: {
            target: [
                './src/**/*.babel.js',
                './test/**/*.babel.js',
            ],
        },

        watch: {
            fast: {
                files: watchFiles,
                tasks: [
                    'eslint',
                    'webpack:dev',
                    'shell:cp_static',
                ],
            },
            frontend: {
                files: watchFiles,
                tasks: [
                    'eslint',
                    'webpack:dev',
                    'shell:cp_static',
                    'karma:test',
                ],
            },
            fe_unit: {
                files: watchFiles,
                // github.com/karma-runner/grunt-karma#karma-server-with-grunt-watch
                tasks: [
                    'eslint',
                    'karma:test',
                ],
            },
            static: {
                files: ['./src/client/js/drawLesson.js', './src/client/index.html'],
                tasks: ['shell:cp_static'],
            },
            backend: {
                files: ['../source/**/*.py'],
                tasks: ['shell:be_test'],
            },
        },

        karma: {
            options: {
                basePath: '',
                frameworks: ['mocha', 'chai', 'sinon-chai'],
                autoWatch: false,
                singleRun: true,
                concurrency: 1,
                logLevel: 'INFO',
                colors: true,
                browsers: ['Chrome_allow_media'],
                customLaunchers: {
                    Chrome_allow_media: {
                        base: 'Chrome',
                        flags: ['--use-fake-ui-for-media-stream'],
                    },
                },
                webpackMiddleware: {
                    noInfo: true,
                },
                webpack: {
                    devtool: 'inline-source-map',
                    module: {
                        loaders: [ custom_babel_loader, loaders ],
                    },
                    externals: {
                        'cheerio': 'window',
                        'react/addons': true,
                        'react/lib/ExecutionEnvironment': true,
                        'react/lib/ReactContext': true,
                    },
                },
            },
            dev: {
                preprocessors: karma_preprocessors,
                files: karma_files,
                exclude: ['test/coverage/**/*', '*bundle*'],
                reporters: ['progress'],
                background: true,
                singleRun: false,
            },
            test: {
                preprocessors: karma_preprocessors,
                files: karma_files,
                exclude: ['test/coverage/**/*', '*bundle*'],
                reporters: ['progress'],
            },
            coverage: {
                preprocessors: karma_preprocessors,
                files: karma_files,
                coverageReporter: {
                    type: 'text',
                },
                reporters: ['progress', 'coverage'],
                browserNoActivityTimeout: 40000,
                webpack: {
                    module: {
                        loaders: [ custom_babel_loader, loaders ],
                        postLoaders: [
                            {
                                test: /\.js$/,
                                include: path.resolve('src/client/'),
                                exclude: /(test|node_modules)\//,
                                loader: 'istanbul-instrumenter',
                            },
                        ],
                    },
                },
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

                entry: [
                    // Set up an ES6-ish environment
                    'babel-polyfill',
                    // Application's script
                    './src/client/js/index.jsx',
                ],
                output: {
                    path: './export/js/',
                    filename: '[name].bundle.js',
                    // serve your source maps from a server that is only accessible to your development team
                    // sourceMapFilename: '[name].bundle.js.map'
                },
                module: {
                    loaders: [ custom_babel_loader, loaders ],
                },
                resolve: {
                    modulesDirectories: ['node_modules'],
                },
                stats: {
                    modules: false,
                    reasons: false,
                    version: false,
                    hash: false,
                },
                progress: true,
            },
            dev: {
                failOnError: false, // don't report error to grunt if webpack find errors
                devtool: 'sourcemap',
                debug: true,
            },
            build: {
                plugins: [
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.OccurenceOrderPlugin(),
                    new webpack.optimize.MinChunkSizePlugin({
                        minChunkSize: 51200, // ~50kb
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        mangle: true,
                    }),
                ],
                failOnError: true,
            },
        },

        shell: {
            be_test: {
                // NOTE: when tox has multiple test configs, switch to `command: tox`, simple no options necessary
                command: [
                    'source ../.tox/py34-postgresql/bin/activate',
                    'python manage.py test',
                ].join('&&'),
                options: {
                    execOptions: {
                        cwd: '../source',
                    },
                },
            },
            killall: {
                // Just in case it is running, wasted lots of time on this
                command: [
                    'killall -9 node',
                    'killall -9 python',
                ].join(';'),
                options: { failOnError: false },
            },
            runserver: {
                command: [
                    'source ../.tox/py34-postgresql/bin/activate',
                    'python manage.py runserver',
                ].join('&&'),
                options: {
                    execOptions: {
                        cwd: '../source',
                    },
                },
            },
            cp_static: {
                command: [
                    'set -x',  // make the commands echo to stdout
                    'mkdir -p ../source/lesson/static/js',  // for dev server
                    'mkdir -p ../source/lesson/static/assets',  // for dev server
                    'cp ./src/client/assets/* ../source/lesson/static/assets/',
                    'cp ./src/client/index.html ../source/lesson/templates/',
                    'cp ./export/js/* ../source/lesson/static/js/',
                ].join('&&'),
            },
        },

        concurrent: {
            dev: {
                tasks: ['shell:runserver', 'watch:fast'],
                options: {
                    logConcurrentOutput: true,
                },
            },
        },

    });
    grunt.registerTask('default', ['shell:killall', 'webpack:dev', 'shell:cp_static', 'karma:test', 'shell:be_test', 'concurrent:dev']);
    grunt.registerTask('dev', ['shell:killall', 'webpack:dev', 'shell:cp_static', 'concurrent:dev']);
    grunt.registerTask('fe_unit', ['shell:killall', 'karma:test']);
    grunt.registerTask('coverage', ['karma:coverage']);
    grunt.registerTask('build', ['webpack:build', 'shell:cp_static']);
    grunt.registerTask('test', ['karma:test', 'shell:be_test']);

};


var loaders = [
    {
        test: /\.(less|css)$/,
        loader: 'style-loader!css-loader!less-loader',
    },
    {
        test: /\.png$/,
        loader: 'url-loader?limit=100000',
    },
    {
        test: /\.jpg$/,
        loader: 'file-loader',
    },
    {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
    },
    {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
    },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
    },
];

var watchFiles = [
    './src/client/**/*',
    './test/**/*',
    '!./test/**/static/js/*',
    '!./test/**/index.html',
];

// http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack
var custom_babel_loader = {
    loader: 'babel',
    exclude: /node_modules/,

    // Only run `babel.js` and `.jsx` files through Babel
    test: /(\.babel\.js$|\.jsx$)/,

    // Options to configure babel with
    query: {
        compact: false, // TODO this should be removed for production deploys
        plugins: [
            'add-module-exports',
            'transform-runtime',
        ],
        presets: ['es2015', 'react'],
    },
};

var karma_preprocessors = {
    'test/**/spec.*.babel.js': ['webpack', 'sourcemap'],
    'test/**/spec.*.js': ['webpack', 'sourcemap'],
};

var karma_files = [
    { src: 'test/**/spec.*.js' },
];
