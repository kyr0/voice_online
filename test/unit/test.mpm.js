///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var MPM = require("../../spikes/pitch/mpm.js");

suite('MPM Class', function() {
    setup(function() {
        //...
    });
    suite('test_MPM', function() {
        var mpm = new MPM(48000);
        test("should have a sampleRate of 48000", function() {
            assert.equal(mpm.__testonly__.sampleRate, 48000);
        });
        test("should have a bufferSize of DEFAULT_BUFFER_SIZE", function() {
            assert.equal(mpm.__testonly__.DEFAULT_BUFFER_SIZE, mpm.__testonly__.bufferSize);
        });
        test("should have a cutoff of DEFAULT_CUTOFF", function() {
            assert.equal(mpm.__testonly__.DEFAULT_CUTOFF, mpm.__testonly__.cutoff);
        });
        var mpm2 = new MPM(48000, 2048, 0.93);
        test("should have a bufferSize of DEFAULT_BUFFER_SIZE", function() {
            assert.equal(2048, mpm2.__testonly__.bufferSize);
        });
        test("should have a cutoff of DEFAULT_CUTOFF", function() {
            assert.equal(0.93, mpm2.__testonly__.cutoff);
        });


    });
});