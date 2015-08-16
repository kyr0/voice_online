///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var PitchDetectionResult = require("../../spikes/pitch/js/PitchDetectionResult.js");

suite('PitchDetectionResult Class', function() {
    setup(function() {
        //...
    });
    suite('test_PDR:', function() {

        var pdr = new PitchDetectionResult();

        test("should have a default pitch of -1", function() {
            assert.equal(-1, pdr.getPitchFrequency());
        });

        test("should have a default probability of -1", function() {
            assert.equal(-1, pdr.getProbability());
        });

        test("should have a default isPitched() of false", function() {
            assert.equal(false, pdr.isPitched());
        });

        test("setPitch() should throw an error if attempt to set invalid pitch (string)", function() {
            var errMsg;
            try {
                pdr.setPitch("Hey");
            }
            catch(err) {
                errMsg = err.message;
            }
            assert.equal("setPitch(): not a valid pitch setting, was: Hey", errMsg);
        });

        test("setPitch() should throw an error if attempt to set invalid pitch (neg #)", function() {
            var errMsg;
            try {
                pdr.setPitch(-.5);
            }
            catch(err) {
                errMsg = err.message;
            }
            assert.equal("setPitch(): not a valid pitch setting, was: -0.5", errMsg);
        });

        var testPitch = 21345;
        var testProb = -21345;
        test("setPitch() should be happy when I use any positive number", function() {
            pdr.setPitch(testPitch);
            assert.equal(testPitch, pdr.getPitchFrequency());
        });

        test("setProbability() should throw an error if attempt to set invalid probability (string)", function() {
            var errMsg;
            try {
                pdr.setProbability("Hey");
            }
            catch(err) {
                errMsg = err.message;
            }
            assert.equal("setProbability(): not a valid setting, was: Hey", errMsg);
        });

        test("setProbability() should be happy when I use any number", function() {
            pdr.setProbability(testProb);
            assert.equal(testProb, pdr.getProbability());
        });

        test("setIsPitched() should throw an error if attempt to set non-boolean", function() {
            var errMsg;
            try {
                pdr.setIsPitched("Hey");
            }
            catch(err) {
                errMsg = err.message;
            }
            assert.equal("setIsPitched(): not a valid setting, was: Hey", errMsg);
        });

        test("isPitched() should be happy when I use any boolean", function() {
            pdr.setIsPitched(true);
            assert.equal(true, pdr.isPitched());
        });

        test("PDR object should evaluate to a number by default", function() {
            assert.equal(testPitch, pdr);
        });
    });
});


