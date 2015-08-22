"use strict";

var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('Test helper', function() {

    describe('catchError()', function () {

        it("should execute functions with a single passed in value parameter", function () {
            var testFunction = function (value) {throw new Error ("Simple function error:" + value)};
            var errMsg = "Simple function error:150";
            expect(catchError(testFunction, 150)).toEqual(errMsg);
        });

        it("should execute methods on Object parameter", function () {
            var testFunction = {
                testMethod: function (value) {
                    throw new Error("Object method error:" + value)
                }
            };
            var errMsg = "Object method error:150";
            expect(catchError("testMethod", 150, testFunction)).toEqual(errMsg);
        });

        it("should be able to execute functions with any number of value parameters", function () {
            var testFunction = function (v1, v2, v3, v4, v5) {
                throw new Error ("Array parameter error:" + v1 + v2 + v3 + v4 + v5)
            };
            var errMsg = "Array parameter error:1502yo34fun";
            expect(catchError(testFunction, [150, 2, "yo", Math.abs(-34), "fun"])).toEqual(errMsg);
        });

        it("should execute multiple parameters for methods of optional Object parameter", function () {
            var testFunction = {
                testMethod: function (v1, v2) {
                    throw new Error("Object method array parameter error:" + v1 + v2)
                }
            };
            var errMsg = "Object method array parameter error:hi7";
            expect(catchError("testMethod", ["hi", 7], testFunction)).toEqual(errMsg);
        });
    });
});



