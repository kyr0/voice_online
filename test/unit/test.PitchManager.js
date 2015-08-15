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
            assert.equal(16.352, pEval.getNoteByName("C0").frequency);
        });

        test("C0 should have previousNote set to null", function() {
            assert.equal(null, pEval.getNoteByName("C0").previousNote);
        });

        test("B8 should have nextNote set to null", function() {
            assert.equal(null, pEval.getNoteByName("B8").nextNote);
        });

        test("B8 should know its own name", function() {
            assert.equal("B8", pEval.getNoteByName("B8").name);
        });

        var testFreq = pEval.getNoteByName('Gb0').frequency;
        test("getCentsDiff() should give zero for perfect pitch", function() {
            assert.equal(0, pEval.getCentsDiff(23.125, testFreq));
        });

        test("getCentsDiff() should give zero for near perfect pitch (flat)", function() {
            assert.equal(0, pEval.getCentsDiff(23.119, testFreq));
        });

        test("getCentsDiff() should give zero for near perfect pitch (sharp)", function() {
            assert.equal(0, pEval.getCentsDiff(23.130, testFreq));
        });

        test("getCentsDiff() should give null for diff = 1 semitone flat", function() {
            assert.equal(null, pEval.getCentsDiff(21.827, testFreq));
        });

        test("getCentsDiff() should give null for diff > 1 semitone flat", function() {
            assert.equal(null, pEval.getCentsDiff(20, testFreq));
        });

        test("getCentsDiff() should give null for diff = 1 semitone sharp", function() {
            assert.equal(null, pEval.getCentsDiff(24.500, testFreq));
        });

        test("getCentsDiff() should give null for diff > 1 semitone sharp", function() {
            assert.equal(null, pEval.getCentsDiff(25, testFreq));
        });

        test("getCentsDiff() should throw an error for flat notes below C0", function() {
            var errMsg;
            try {
                pEval.getCentsDiff(16.351, 'C7');
            }
            catch(err) {
                errMsg =  err.message;
            }
            assert.equal("getCentsDiff(): the frequency is outside the threshold - Fq:16.351", errMsg);
        });

        test("getCentsDiff() should throw an error for sharp notes above B8", function() {
            var errMsg;
            try {
                pEval.getCentsDiff(7902.2, 'B8');
            }
            catch(err) {
                errMsg = err.message;
            }
            assert.equal("getCentsDiff(): the frequency is outside the threshold - Fq:7902.2", errMsg);
        });

        test("should be able to use pitchArray to lookup Note object", function() {
            assert.equal(16.352, pEval.__testonly__pMap.pitchArray[0]);
            assert.equal("C0", pEval.__testonly__pMap.reverseMap[16.352].name);
        });

        test("should be able to use pitchArray to lookup Note object when freq is not exact", function() {
            // 3840.2 is ~50 cents above the high cutoff
            assert.equal(pEval.getNoteByName("A7").frequency, pEval.getClosestFreqFromPitch(3623.1));
            // 53.4565 is ~50 cents below A1 (low freq cutoff)50 cents below A1 (low freq cutoff)
            assert.equal(pEval.getNoteByName("A1").frequency, pEval.getClosestFreqFromPitch(53.435));
        });

        test("should be able to use pitchArray to lookup Note object when freq is not exact", function() {
            // NOTE: 50 cents equals .5 semitone
            // 3226.9 is 49 cents above the high cutoff
            assert.equal(49, pEval.getCentsDiff(3226.9, 'G7'));
            // 53.450 is -49 cents below A1 (low freq cutoff)50 cents below A1 (low freq cutoff)
            assert.equal(-49, pEval.getCentsDiff(53.450, 'A1'));
            // there is .31 unaccounted for between these edges of 49
            assert.equal(-49, pEval.getCentsDiff(427.65, 'A4'));
            assert.equal(49, pEval.getCentsDiff(427.34, 'Ab4'));
            // the 50 cent overlaps in mysterious ways -- .23 overlap of the 50
            assert.equal(-50, pEval.getCentsDiff(427.36, 'A4'));
            assert.equal(50, pEval.getCentsDiff(427.59, 'Ab4'));
        });

    });

});


