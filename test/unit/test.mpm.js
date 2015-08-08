///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var contentKeyPage = require("../../spike/pitch_v2/js/mpm.js");

suite('index.js', function() {
    setup(function() {
        // ...
    });

    suite('test_MPM', function() {
        test("should return appropriate warning when input is not formatted correctly", function() {
            document.getElementById("contextKeyInput").value = "adventure time";
            assert.equal(typeof contentKeyPage.content, 'object');
        });


    });
});