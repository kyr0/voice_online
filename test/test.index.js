///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var index = require("../src/browser/js/index.js");

suite('ContentObject', function() {
    setup(function() {
        // ...
    });

    suite('content', function() {
        test("should be an Object type", function() {
            assert.equal(typeof index.content, 'object');
        });
        test("should stringify to 'content'", function() {
            assert.equal("content", index.content.toString());
        });
        test('landingpages should be an Object type', function() {
            assert.equal(typeof index.landingpages, 'object');
        });
        test('landingpages inheriting from content', function() {
            assert.equal(index.landingpages.__proto__, 'content');
        });
        test('landingpages should stringify to "content.landingpages"', function() {
            assert.equal("content.landingpages", index.landingpages.toString());
        });

    });
});