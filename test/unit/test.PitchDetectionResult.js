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
            assert.equal(-1, pdr.getPitch());
        });

        test("should have a default probability of -1", function() {
            assert.equal(-1, pdr.getProbability());
        });

        test("should have a default isPitched() of false", function() {
            assert.equal(false, pdr.isPitched());
        });

        test("setPitch() should throw an error if attempt to set invalid pitch (string)", function() {
            try {
                pdr.setPitch("Hey");
            }
            catch(err) {
                assert.equal("setPitch(): not a valid pitch setting, was: Hey", err.message);
            }
        });

        test("setPitch() should throw an error if attempt to set invalid pitch (neg #)", function() {
            try {
                pdr.setPitch(-.5);
            }
            catch(err) {
                assert.equal("setPitch(): not a valid pitch setting, was: -0.5", err.message);
            }
        });

        test("setPitch() should be happy when I use any positive number", function() {
            pdr.setPitch(21345);
            assert.equal(21345, pdr.getPitch());
        });

        test("setProbability() should throw an error if attempt to set invalid probability (string)", function() {
            try {
                pdr.setProbability("Hey");
            }
            catch(err) {
                assert.equal("setProbability(): not a valid setting, was: Hey", err.message);
            }
        });

        test("setProbability() should be happy when I use any number", function() {
            pdr.setProbability(-21345);
            assert.equal(-21345, pdr.getProbability());
        });

        test("setIsPitched() should throw an error if attempt to set non-boolean", function() {
            try {
                pdr.setIsPitched("Hey");
            }
            catch(err) {
                assert.equal("setIsPitched(): not a valid setting, was: Hey", err.message);
            }
        });

        test("isPitched() should be happy when I use any boolean", function() {
            pdr.setIsPitched(true);
            assert.equal(true, pdr.isPitched());
        });
    });
});


