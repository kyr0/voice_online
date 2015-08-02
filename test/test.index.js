///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var contentKeyPage = require("../src/browser/js/contentKey.js");

suite('index.js', function() {
    setup(function() {
        // ...
    });

    suite('test_index', function() {
        test("should be an Object type", function() {
            assert.equal(typeof contentKeyPage.content, 'object');
        });


    });
});