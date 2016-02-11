/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";
    require('shelljs/global');
    var version = require("../util/version_checker.js");
    var jshint = require("simplebuild-jshint");
    var jshintConfig = require("../config/jshint.conf.js");
    var mochify = require("mochify");
    var browserify = require('browserify');
    var browserifyPaths = require("../config/browserify.conf.js");

    var startTime = Date.now();

    var wrapUp = function () {
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nOK (" + elapsedSeconds.toFixed(2) + "s)");
    };

    desc("Lint and test everything");
    task("default", [ "version", "lint", "browserify", "test" ], function(){
        wrapUp();
    });

    desc("Run only client component tests");
    task("itgrOnly", [ "testIntegration" ], function(){
        wrapUp();
    });

    desc("Run only unit tests");
    task("unitOnly", [ "browserify", "testClientUnit" ], function(){
        wrapUp();
    });

    // *** LINT
    desc("Lint everything");
    task("lint", [ "lintClient" ]);

    task("lintNode", function() {
        process.stdout.write("\nLinting build code:");
        jshint.checkFiles({
            files: [ "build/**/*.js" ],
            options: jshintConfig.nodeOptions,
            globals: jshintConfig.nodeGlobals
        }, complete, fail);
    }, {async: true});

    task("lintClient", function() {
        process.stdout.write("\nLinting client-side code:");
        jshint.checkFiles({
            files: ["src/client/**/*.js",
                "!src/**/*.bundle.js"],
            options: jshintConfig.clientOptions,
            globals: jshintConfig.clientGlobals
        }, complete, fail);
    }, {async: true});

    // *** TEST
    desc("Test everything");
    task("test", [ "browserify", "testClientUnit", "testIntegration" ], {async: true},
        function(){
            wrapUp();
    });


    task("testClientUnit", function(){
        process.stdout.write("\n\nRunning client unit tests:\n\n");
        mochify("test/unit/**/spec.*.js", {
            node: true
        }).bundle(function(err,buf){
            if (buf) {
                console.log(buf.toString());
                if (buf.toString().search("failing") >= 0) {
                    fail("Client has failing unit tests");
                } else if (buf.toString().search("Error:") >= 0) {
                    fail();
                }
                else complete();
            }
        });
    }, {async: true});


    task("testIntegration", function(){
        process.stdout.write("\n\nRunning client integration tests:\n\n");
        mochify("test/integration/**/spec.*.js", {
            node: true
        }).bundle(function(err,buf){
            if (buf) {
                console.log(buf.toString());
                if (buf.toString().search("failing") >= 0) {
                    fail("Integration tests have failures");
                } else if (buf.toString().search("Error:") >= 0) {
                    fail();
                }
                else complete();
            }
            });
    }, {async: true});


    // *** CHECK VERSION
    task("version", function(){
        process.stdout.write("Checking Node.js version: .\n");
        version.check({
            name: "Node",
            expected: require("../../package.json").engines.node,
            actual: process.version,
            strict: true
        }, complete, fail);
    }, {async: true});


    // *** BROWSERIFY ALL THE THINGS
    task('browserify', {async: true}, function () {
        process.stdout.write("\n\nCompiling browserify bundles:\n\n");
        var binPath = './node_modules/browserify/bin/cmd.js ';
        var brwPaths = browserifyPaths.pathList;
        var cmds = [];
        /* jshint ignore:start */
        for (var i = 0; i < brwPaths.length; i++) {
            cmds.push(exec(binPath + brwPaths[i], function(code, output) {
                if (code !== 0) {
                    console.log('Exit code:', code);
                    console.log('Program output:', output);
                }
            }));
        }
        /* jshint ignore:end */
        console.log('Finished bundles.');
        complete();
    });


    // *** WATCHIFY FOR FAST DEVELOPMENT
    task('watchify', {async: true}, function () {
        process.stdout.write("\n\nWatching for changes to browserify bundles:\n\n");
        var binPath = './node_modules/watchify/bin/cmd.js ';
        var brwPaths = browserifyPaths.pathList;
        /* jshint ignore:start */
        for (var i = 0; i < brwPaths.length; i++) {
            exec(binPath + brwPaths[i] + " -v", {async : true});
        }
        /* jshint ignore:end */
        console.log('Watching the things.');
    });

}());