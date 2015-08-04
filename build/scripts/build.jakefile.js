/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";
    var protractor = require("protractor");
    var version = require("../util/version_checker.js");
    var jshint = require("simplebuild-jshint");
    var jshintConfig = require("../config/jshint.conf.js");
    var mochify = require("mochify");
    //var karmaConfig = require("../config/karma.conf.js");

    var startTime = Date.now();

    desc("Lint and test");
    task("default", [ "version", "lint", "browserify", "test" ], function(){
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nBUILD OK (" + elapsedSeconds.toFixed(2) + "s)");
    });

    desc("E2E tests only");
    task("E2EOnly", [ "browserify", "testE2E" ], function(){
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nBUILD OK (" + elapsedSeconds.toFixed(2) + "s)");
    });

    desc("Unit tests only");
    task("UnitOnly", [ "broserify", "testNode", "testBrowser" ], function(){
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nBUILD OK (" + elapsedSeconds.toFixed(2) + "s)");
    });

    // *** LINT
    desc("Lint everything");
    task("lint", [ "lintNode", "lintClient" ]);

    task("lintNode", function() {
        process.stdout.write("\nLinting build and server code:");
        jshint.checkFiles({
            files: [ "build/**/*.js", "src/server/**/*.js"],
            options: jshintConfig.nodeOptions,
            globals: jshintConfig.nodeGlobals
        }, complete, fail);
    }, {async: true});

    task("lintClient", function() {
        process.stdout.write("\nLinting browser code:");
        jshint.checkFiles({
            files: ["src/browser/**/*.js",
                "!src/**/*.bundle.js"],
            options: jshintConfig.clientOptions,
            globals: jshintConfig.clientGlobals
        }, complete, fail);
    }, {async: true});

    // *** TEST
    desc("Test everything");
    //task("test", [ "testNode", "testBrowser", "karmaTest" ]);
    task("test", [ "testNode", "testBrowser", "testE2E" ]);

    task("testNode", [], function(){
        process.stdout.write("\nTesting node server code:\n");
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['./src/server/test/_server_test.js'], null, function(failures){
            if (failures) fail("Node server has failing tests.");
            else complete();
        });
    }, {async: true});

    task("testBrowser", function(){
        process.stdout.write("\n\nRunning browser-based unit tests:\n\n");
        var brwfy = mochify("test/unit/**/*.js", {
            phantomjs: "./node_modules/.bin/phantomjs",
            ui: "tdd"
        }).bundle(function(err,buf){
            console.log(buf.toString());
            if (buf.toString().search("failing") >= 0) {
                fail("Browser has failing tests.");
            }
            else complete();
            });
    }, {async: true});

    task('testE2E', {async: true}, function () {
        process.stdout.write("\n\nRunning browser-based E2E tests:\n\n");
        //'./node_modules/protractor/bin/webdriver-manager start',
        var cmds = [
            './node_modules/protractor/bin/protractor ./build/config/protractor.conf.js'
        ];
        jake.exec(cmds, {printStdout: true}, function () {
            console.log('All tests passed.');
            complete();
        });
    });

    //task("karmaTest", function(){}, {async: true});


    // *** CHECK VERSION
    desc("Check Node version");
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
    desc("Browserify the things");
    task('browserify', {async: true}, function () {
        process.stdout.write("\n\nCompiling browserify bundles:\n\n");
        var binPath = './node_modules/browserify/bin/cmd.js ';
        // in future with more bundles we'll want to generate this better
        var someArgs = './src/browser/js/index.js > ./src/browser/js/index.bundle.js';
        var cmds = [
            binPath + someArgs
        ];
        jake.exec(cmds, {printStdout: true}, function () {
            console.log('All tests passed.');
            complete();
        });
    });


}());