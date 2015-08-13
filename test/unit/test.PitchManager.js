///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var pEval = require("../../spikes/pitch/js/PitchManager.js");


suite('Pitch Evaluation library', function() {
    setup(function() {
        //...
    });
    suite('test_PitchEvaluation:', function() {

        test("first element of pitch map should be C0 ", function() {
            assert.equal(16.352, pEval.getNote("C0").frequency);
        });

        test("C0 should have previousNote set to null", function() {
            assert.equal(null, pEval.getNote("C0").previousNote);
        });

        test("B8 should have nextNote set to null", function() {
            assert.equal(null, pEval.getNote("B8").nextNote);
        });

        test("B8 should know its own name", function() {
            assert.equal("B8", pEval.getNote("B8").name);
        });

        test("getCentsDiff() should give a negative value for flat notes", function() {
            assert.equal(-87, pEval.getCentsDiff(22, 'Gb0'));
        });

        test("getCentsDiff() should give a positive value for sharp notes", function() {
            assert.equal(2, pEval.getCentsDiff(23.150, 'Gb0'));
        });

        test("getCentsDiff() should give zero for perfect pitch", function() {
            assert.equal(0, pEval.getCentsDiff(23.125, 'Gb0'));
        });

        test("getCentsDiff() should give zero for near perfect pitch (flat)", function() {
            assert.equal(0, pEval.getCentsDiff(23.119, 'Gb0'));
        });

        test("getCentsDiff() should give zero for near perfect pitch (sharp)", function() {
            assert.equal(0, pEval.getCentsDiff(23.130, 'Gb0'));
        });

        test("getCentsDiff() should give null for diff = 1 semitone flat", function() {
            assert.equal(null, pEval.getCentsDiff(21.827, 'Gb0'));
        });

        test("getCentsDiff() should give null for diff > 1 semitone flat", function() {
            assert.equal(null, pEval.getCentsDiff(20, 'Gb0'));
        });

        test("getCentsDiff() should give null for diff = 1 semitone sharp", function() {
            assert.equal(null, pEval.getCentsDiff(24.500, 'Gb0'));
        });

        test("getCentsDiff() should give null for diff > 1 semitone sharp", function() {
            assert.equal(null, pEval.getCentsDiff(25, 'Gb0'));
        });

        test("getCentsDiff() should throw an error for flat notes below threshold", function() {
            try {
                pEval.getCentsDiff(15, 'C0');
            }
            catch(err) {
                assert.equal("getCentsDiff(): the frequency is outside the threshold - Fq:15", err.message);
            }
        });

        test("getCentsDiff() should throw an error for sharp notes above threshold", function() {
            try {
                pEval.getCentsDiff(9000, 'B8');
            }
            catch(err) {
                assert.equal("getCentsDiff(): the frequency is outside the threshold - Fq:9000", err.message);
            }
        });

    });

});


