/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";

    var version = require("../util/version_checker.js");
    var jshint = require("simplebuild-jshint");
    var jshintConfig = require("../config/jshint.conf.js");
    var karmaConfig = require("../config/karma.conf.js");
    var mochify = require("mochify");

    var startTime = Date.now();

    desc("Lint and test");
    task("default", [ "version", "lint", "test" ], function(){
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nBUILD OK (" + elapsedSeconds.toFixed(2) + "s)");
    });

    // *** LINT
    desc("Lint everything");
    task("lint", [ "lintNode", "lintClient" ]);

    task("lintNode", function() {
        process.stdout.write("\nLinting Node.js code:");
        jshint.checkFiles({
            files: [ "build/**/*.js"],
            options: jshintConfig.nodeOptions,
            globals: jshintConfig.nodeGlobals
        }, complete, fail);
    }, {async: true});

    task("lintClient", function() {
        process.stdout.write("\nLinting browser code:");
        jshint.checkFiles({
            files: ["src/**/*.js",
                "spikes/canvas/scripts/canvas.js",
                "spikes/canvas/scripts/_canvas_test.js"],
            options: jshintConfig.clientOptions,
            globals: jshintConfig.clientGlobals
        }, complete, fail);
    }, {async: true});

    // *** TEST
    desc("Test everything");
    //task("test", [ "testNode", "testBrowser", "karmaTest" ]);
    task("test", [ "testNode", "testBrowser" ]);

    task("testNode", [], function(){
        process.stdout.write("\nTesting node server code:\n");
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['./src/server/test/_server_test.js'], null, function(failures){
            if (failures) fail("Node server has failing tests.");
            else complete();
        });
    }, {async: true});

    task("testBrowser", function(){
        process.stdout.write("\n\nTesting browser code:\n\n");
        var brwfy = mochify('./test/**/*.js',{
            phantomjs: "./node_modules/.bin/phantomjs",
            recursive: true,
            ui: "tdd"
        }).bundle(function(err,buf){
            console.log(buf.toString());
            if (buf.toString().search("failing") >= 0) {
                fail("Browser has failing tests.");
            }
            else complete();
            });
    }, {async: true});

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

}());