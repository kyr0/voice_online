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
    var bsync = require("browser-sync").create();
    //var karmaConfig = require("../config/karma.conf.js");

    var startTime = Date.now();

    var wrapUp = function () {
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nBUILD OK (" + elapsedSeconds.toFixed(2) + "s)");
        if (bsync.active) {
            console.log("\nExiting browser-sync server instance.");
            bsync.exit();
        }
    };

    desc("Lint and test everything");
    task("default", [ "version", "lint", "browserify", "test" ], function(){
        wrapUp();
    });

    desc("E2E tests only");
    task("E2EOnly", [ "browserify", "testE2E" ], function(){
        wrapUp();
    });

    desc("Unit tests only");
    task("UnitOnly", [ "browserify", "testServerUnit", "testClientUnit" ], function(){
        wrapUp();
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
    task("test", [ "testServerUnit", "testClientUnit", "testE2E" ]);

    task("testServerUnit", [], function(){
        process.stdout.write("\nTesting node server code:\n");
        var reporter = require("nodeunit").reporters["default"];
        reporter.run(['./src/server/test/_server_test.js'], null, function(failures){
            if (failures) fail("Node server has failing tests.");
            else complete();
        });
    }, {async: true});

    task("testClientUnit", function(){
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

    desc("Run the E2E tests in a browser with http & selenium servers");
    task('testE2E', ["startBServer"], {async: true}, function () {
        process.stdout.write("\n\nStarting browser-based E2E tests:\n\n");
        var t = jake.Task.runE2E;
        t.addListener('complete', function () {
            console.log('Finished executing E2E tests');
            complete();
        });
        // Kick off runE2e
        t.invoke();

        //'./node_modules/protractor/bin/webdriver-manager start',
    });


    task('runE2E', {async:true}, function () {
        var testE2Etask = this;
        var protractorBin = "./node_modules/protractor/bin/protractor";
        var protractorConf = "./build/config/protractor.conf.js";
        var protractorSpecs = "--specs './test/e2e/spec.js'";
        var cmds = [
            protractorBin + " " + protractorConf + " " + protractorSpecs
        ];
        var ex = jake.createExec(cmds);
        ex.addListener('stdout', function(chunk){
            console.log(chunk.toString());
        });
        ex.addListener('stderr', function(chunk){
            console.log(chunk.toString());

        });
        ex.addListener('cmdEnd', function(){
            complete();
        });
        ex.run();

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

    // *** BROWSER-SYNC SERVER MANAGEMENT
    desc("Run an instance of browser-sync server");
    task('startBServer', {async: true}, function () {
        process.stdout.write("\n\nRunning browser-sync server:\n\n");
        bsync.init({
            server: {
                baseDir: ["src/browser"],
                index: "index.html"
            },
            open: false
        });
        complete();
    });

}());