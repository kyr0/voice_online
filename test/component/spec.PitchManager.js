
"use strict";

var pEval = require("../../spikes/pitch/js/PitchManager.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('Pitch Evaluation library', function() {
    var freqC0 = 16.352;


    it("note object should know its own name", function() {
        expect(pEval.getClosestNoteFromPitch(freqC0).name).toEqual("C0");
    });

    describe('getNoteByName()', function() {

        it("lowest note C0 should show a frequency of 16.352", function () {
            expect(pEval.getNoteByName("C0").frequency).toEqual(freqC0);
        });

        it("lowest note C0 should have previousNote set to null", function () {
            expect(pEval.getNoteByName("C0").previousNote).toBeNull();
        });

        it("highest note B8 should have nextNote set to null", function () {
            expect(pEval.getNoteByName("B8").nextNote).toBeNull();
        });
    });

    describe('getCentsDiff()', function() {
        beforeEach(function(){
            this.nameGb0 = "Gb0";
        });

        it("should return zero cents for perfect pitch", function () {
            var incomingFreq = 23.125;
            expect(pEval.getCentsDiff(incomingFreq, this.nameGb0)).toEqual(0);
        });

        it("should give zero for near perfect pitch (slightly flat)", function () {
            expect(pEval.getCentsDiff(23.119, this.nameGb0)).toBe(0);
        });

        it("should give zero for near perfect pitch (slightly sharp)", function () {
            expect(pEval.getCentsDiff(23.130, this.nameGb0)).toEqual(0);
        });

        it("should give null for diff = 1 semitone flat", function () {
            expect(pEval.getCentsDiff(21.827, this.nameGb0)).toBeNull();
        });

        it("should give null for diff > 1 semitone flat", function () {
            expect(pEval.getCentsDiff(20, this.nameGb0)).toBeNull();
        });

        it("should give null for diff = 1 semitone sharp", function () {
            expect(pEval.getCentsDiff(24.500, this.nameGb0)).toBeNull();
        });

        it("should give null for diff > 1 semitone sharp", function () {
            expect(pEval.getCentsDiff(25, this.nameGb0)).toBeNull();
        });

        it("should throw an error for flat notes below C0", function () {
            var errMsg = "getCentsDiff(): the frequency is outside the threshold - Fq:16.351";
            expect(catchError("getCentsDiff", [16.351, 'C7'], pEval)).toEqual(errMsg);
        });

        it("should throw an error for sharp notes above B8", function () {
            var errMsg = "getCentsDiff(): the frequency is outside the threshold - Fq:7902.2";
            expect(catchError("getCentsDiff", [7902.2, 'B8'], pEval)).toEqual(errMsg);
        });

        it("should calculate accurately when frequency <= 50 cents off", function () {
            // 3226.9 is 49 cents above the high cutoff
            expect(pEval.getCentsDiff(3226.9, 'G7')).toEqual(49);
            // 53.450 is -49 cents below A1 (low freq cutoff)50 cents below A1 (low freq cutoff)
            expect(pEval.getCentsDiff(53.450, 'A1')).toEqual(-49);
            // there is .31 unaccounted for between these edges of 49
            expect(pEval.getCentsDiff(427.65, 'A4')).toEqual(-49);
            expect(pEval.getCentsDiff(427.34, 'Ab4')).toEqual(49);
            // the 50 cent overlaps in mysterious ways -- .23 overlap of the 50
            expect(pEval.getCentsDiff(427.36, 'A4')).toEqual(-50);
            expect(pEval.getCentsDiff(427.59, 'Ab4')).toEqual(50);
        });


    });

    it("should be able to use frequencies to lookup note object", function() {
        var testFreq = pEval.__testonly__pMap.pitchArray[0];
        expect(pEval.__testonly__pMap.reverseMap[testFreq].name).toEqual("C0");
    });

    it("should be able to lookup note object when frequency <= 50 cents off", function() {
        // NOTE: 50 cents equals .5 semitone
        var sharpA7Freq = 3623.1;
        expect(pEval.getClosestFreqFromPitch(sharpA7Freq)).toEqual(pEval.getNoteByName("A7").frequency);
        var flatA1Freq = 53.435;
        expect(pEval.getClosestFreqFromPitch(flatA1Freq)).toEqual(pEval.getNoteByName("A1").frequency);
    });

});


