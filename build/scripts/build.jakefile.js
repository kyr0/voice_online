/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";

    var version = require("../util/version_checker.js");
    var jshint = require("simplebuild-jshint");

    var startTime = Date.now();

    desc("Lint and test");
    task("default", [ "version", "lint" ], function(){
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nBUILD OK (" + elapsedSeconds.toFixed(2) + "s)");
    });

    // *** LINT
    desc("Lint everything");
    task("lint", [ "lintNode", "lintClient" ]);

    task("lintNode", function() {
        process.stdout.write("Linting Node.js code:");
        jshint.checkFiles({
            files: [ "build/**/*.js"],
            options: {
                node: true
            },
            globals: {
                jake: false,
                desc: false,
                task: false,
                directory: false,
                complete: false,
                fail: false
            }
        }, complete, fail);
    }, {async: true});

    task("lintClient", function() {
        console.log("Linting browser code:");
    });


    // *** CHECK VERSION
    desc("Check Node version");
    task("version", function(){
        console.log("Checking Node.js version: .");
        version.check({
            name: "Node",
            expected: require("../../package.json").engines.node,
            actual: process.version,
            strict: true
        }, complete, fail);
    }, {async: true});

}());