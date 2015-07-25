/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";

    desc("Default build");
    task("default", [ "version" ], function(){
        console.log("\n\nBUILD OK");
    });

    desc("Check Node version");
    task("version", function(){
        console.log("Chrcking Node version: .");
        var packageJson = require("./package.json");
        var expectedVersion = "v" + packageJson.engines.node;

        var actualVersion = process.version;
        if (actualVersion !== expectedVersion) {
            fail("Incorrect Node version: Expected " + expectedVersion + ", but was " + actualVersion);
        }

    });
}());