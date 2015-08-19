"use strict";

var assert = require("assert");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

suite('Common test helpers self-test:', function() {

    suite('catchError()', function () {

        test("should execute functions with one value parameter", function () {
            var testFunction = function (value) {throw new Error ("Simple function error:" + value)};
            assert.equal("Simple function error:150", catchError(testFunction, 150));
        });

        test("should execute methods on optional 3rd object parameter", function () {
            var testFunction = {
                testMethod: function (value) {
                    throw new Error("Object method error:" + value)
                }
            };
            assert.equal("Object method error:150", catchError("testMethod", 150, testFunction));
        });

        test("should be able to execute functions with any number of paramters", function () {
            var testFunction = function (v1, v2, v3, v4, v5) {
                throw new Error ("Array parameter error:" + v1 + v2 + v3 + v4 + v5)
            };
            assert.equal("Array parameter error:1502yo34fun",
                catchError(testFunction, [150, 2, "yo", Math.abs(-34), "fun"]));
        });

        test("should execute multiple parameters for methods of optional 3rd object parameter", function () {
            var testFunction = {
                testMethod: function (v1, v2) {
                    throw new Error("Object method array parameter error:" + v1 + v2)
                }
            };
            assert.equal("Object method array parameter error:hi7", catchError("testMethod", ["hi", 7], testFunction));
        });


    });
});



