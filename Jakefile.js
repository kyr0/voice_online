/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";

    var semver = require("semver");
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
       console.log("Linting Node.js code:");
    });

    task("lintClient", function() {
        console.log("Linting browser code:");
    });


    // *** CHECK VERSION
    desc("Check Node version");
    task("version", function(){
        console.log("Chrcking Node version: .");
        var packageJson = require("./package.json");
        var expectedVersion = packageJson.engines.node;

        var actualVersion = process.version;
        if (semver.neq(expectedVersion, actualVersion)) {
            fail("Incorrect Node version: Expected " + expectedVersion + ", but was " + actualVersion);
        }

    });
}());