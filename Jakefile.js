/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";

    var EXPECTED_NODE_VERSION = "v0.12.7";
    desc("Default build");
    task("default", [ "version" ], function(){
        console.log("\n\nBUILD OK");
    });

    desc("Check Node version");
    task("version", function(){
        console.log("Chrcking Node version: .");
        var actualVersion = process.version;
        if (actualVersion !== EXPECTED_NODE_VERSION) {
            fail("Incorrect Node version: Expected " + EXPECTED_NODE_VERSION + ", but was " + actualVersion);
        }

    });
}());