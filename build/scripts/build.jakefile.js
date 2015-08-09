/**
 * Created by jaboing on 2015-07-25.
 */
(function () {
    "use strict";
    require('shelljs/global');
    var protractor = require("protractor");
    var version = require("../util/version_checker.js");
    var jshint = require("simplebuild-jshint");
    var jshintConfig = require("../config/jshint.conf.js");
    var mochify = require("mochify");
    var bsync = require("browser-sync").create();
    //var karmaConfig = require("../config/karma.conf.js");

    var bsyncPort = 9000;
    var wdPort = 4444;
    var startTime = Date.now();

    /* jshint ignore:start */
    var bsyncIsUpAlready = exec('lsof -i -n -P | grep ' + bsyncPort);
    if (bsyncIsUpAlready.code === 0) {
        var lsofOut = bsyncIsUpAlready.output.split(/[ ,]+/);
        if (lsofOut[0] === "node") {
            console.log('Found an orphaned instance of browser-sync node server:');
            console.log('Running: kill -9 ' + lsofOut[1]);

            exec('kill -9 ' + lsofOut[1]);
        }
        else fail("Something is occupying browser-sync local server's default port");
    }
    /* jshint ignore:end */


    var wrapUp = function () {
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log("\n\nOK (" + elapsedSeconds.toFixed(2) + "s)");

        // if there is an instance of Browser-Sync, kill it
        // becasuse bsync.exit() also exits the jake.sh process, this must be the final action
        if (bsync.active) {
            console.log("\nExiting browser-sync server instance.");
            bsync.exit();
        }
    };

    desc("Lint and test everything");
    task("default", [ "checkWD", "version", "lint", "browserify", "test" ], function(){
        wrapUp();
    });

    desc("Run only end to end UI tests");
    task("e2eOnly", [  "checkWD", "browserify", "testE2E" ], function(){
        wrapUp();
    });

    desc("Run only unit tests");
    task("unitOnly", [ "browserify", "testServerUnit", "testClientUnit" ], function(){
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
    task("test", [ "checkWD", "browserify", "testServerUnit", "testClientUnit", "testE2E" ], {async: true},
        function(){
            wrapUp();
    });

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
        mochify("test/unit/**/*.js", {
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

    task('testE2E', ["startBServer"], {async:true}, function () {
        process.stdout.write("\n\nStarting browser-based E2E tests:\n\n");
        var t = jake.Task.runE2E;
        t.addListener('complete', function () {
            console.log('Finished executing E2E tests');
            complete();
        });
        // Kick off runE2E
        t.invoke();

        //'./node_modules/protractor/bin/webdriver-manager start',
    });
    // *** BROWSER-SYNC SERVER START
    desc("Run an instance of browser-sync server");
    task('startBServer', {async:true}, function () {
        process.stdout.write("\n\nRunning browser-sync server:\n\n");
        bsync.init({
            server: {
                baseDir: ["src/browser"],
                index: "index.html"
            },
            open: false,
            ui: false,
            notify: false,
            port:bsyncPort
        });
        complete();
    });

    // *** RUN THE ACTUAL E2E TESTS USING PROTRACTOR
    task('runE2E', {async:true}, function () {
        var protractorBin = "./node_modules/protractor/bin/protractor";
        var protractorConf = "./build/config/protractor.conf.js";
        var protractorSpecs = "--specs './test/e2e/*.js'";
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
            console.log("Protractor tests complete");
            complete();
        });
        ex.run();

    });


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
        // in future with more bundles we'll want to generate this better
        var bundleLittleBits = './src/browser/js/index.js > ./src/browser/js/bundles/index.bundle.js';
        var bundleCanvas = './spikes/canvas/scripts/canvas.js > ./spikes/canvas/scripts/canvas.bundle.js';
        var bundleMPMSpec = './spikes/pitch/js/test_mpm.js > ./spikes/pitch/js/mpm.bundle.js';
        var cmds = [
            binPath + bundleLittleBits,
            binPath + bundleCanvas,
            binPath + bundleMPMSpec
        ];
        jake.exec(cmds, {printStdout: true}, function () {
            console.log('All tests passed.');
            complete();
        });
    });

    // *** BEGIN SELENIUM WEBDRIVER MADNESS
    // *** CHECK WEBDRIVER SERVER IS UP, IF NOT, START IT
    task('checkWD', {async: true}, function() {
        /* jshint ignore:start */
        var wdIsUpAlready = exec('lsof -i -n -P | grep ' + wdPort);
        if (wdIsUpAlready.code === 0) {
            var lsofOut = wdIsUpAlready.output.split(/[ ,]+/);
            if (lsofOut[0] === "java") {
                console.log('Selenium server is up and running.\n');
                complete();
            }
            else fail("Something is occupying selenium server's default port");
        }
        else {
            // start the server if it's not running already
            jake.Task.startWDServer.invoke();
            complete();
        }
        /* jshint ignore:end */
    });

    /* jshint ignore:start */
    desc("Start an instance of selenium webdriver server and leave it running");
    task('startWDServer', {async: true}, function () {
        // check if the binaries are in place
        exec("./node_modules/protractor/bin/webdriver-manager update");

        process.stdout.write("\n\nStarting selenium standalone server in background\n");
        var child = exec("./node_modules/protractor/bin/webdriver-manager start", {async:true, silent: true});
        child.stdout.on('data', function(data) {
           complete();
        });
    });
    /* jshint ignore:end */
    desc("Kill instances of the selenium server");
    task('killWD', {async: true}, function() {
        /* jshint ignore:start */
        var wdIsUpAlready = exec('lsof -i -n -P | grep ' + wdPort);
        if (wdIsUpAlready.code === 0) {
            var lsofOut = wdIsUpAlready.output.split(/[ ,]+/);
            if (lsofOut[0] === "java") {
                console.log('Killing selenium server...\n');
                exec('kill -9 ' + lsofOut[1]);
                wdIsUpAlready = exec('lsof -i -n -P | grep ' + wdPort);
                if (wdIsUpAlready.code !== 0) {
                    console.log("Done.");
                }
                else fail("Whoops, this is running:\n" + wdIsUpAlready);
            }
            else fail("Something else is occupying selenium server's default port");
        }
        else console.log("No server running.");
        /* jshint ignore:end */
    });



}());