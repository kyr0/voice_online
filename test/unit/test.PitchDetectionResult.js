///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var PitchDetectionResult = require("../../spikes/pitch/js/PitchDetectionResult.js");

var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}


suite('PitchDetectionResult Class', function() {

    var pdr = new PitchDetectionResult();

    suite('defaults:', function() {

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
            assert.equal("setPitch(): not a valid pitch setting, was: Hey", catchFunc("setPitch","Hey", pdr));
        });

        test("setPitch() should throw an error if attempt to set invalid pitch (neg #)", function() {
            assert.equal("setPitch(): not a valid pitch setting, was: -0.5", catchFunc("setPitch", -0.5, pdr));
        });

        var testPitch = 21345;
        var testProb = -21345;
        test("setPitch() should be happy when I use any positive number", function() {
            pdr.setPitch(testPitch);
            assert.equal(testPitch, pdr.getPitchFrequency());
        });

        test("setProbability() should throw an error if attempt to set invalid probability (string)", function() {
            assert.equal("setProbability(): not a valid setting, was: Hey", catchFunc("setProbability", "Hey", pdr));
        });

        test("setProbability() should be happy when I use any number", function() {
            pdr.setProbability(testProb);
            assert.equal(testProb, pdr.getProbability());
        });

        test("setIsPitched() should throw an error if attempt to set non-boolean", function() {
            assert.equal("setIsPitched(): not a valid setting, was: Hey", catchFunc("setIsPitched", "Hey", pdr));
        });

        test("isPitched() should be happy when I use any boolean", function() {
            pdr.setIsPitched(true);
            assert.equal(true, pdr.isPitched());
            pdr.setIsPitched(false);
            assert.equal(false, pdr.isPitched());
        });

        test("PDR object should evaluate to a number object by default", function() {
            assert.equal(testPitch, pdr);
        });
    });

});


