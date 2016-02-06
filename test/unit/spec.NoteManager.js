
"use strict";

var noteMgr = require("../../src/browser/js/NoteManager.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('Pitch Evaluation library', function() {

    it("getDistanceBetweenTwoNotes() should return the distance (positive)", function() {
        expect(noteMgr.getDistanceBetweenTwoNotes("A2", "B2")).to.equal(2);
    });

    it("getDistanceBetweenTwoNotes() should return the distance (negative)", function() {
        expect(noteMgr.getDistanceBetweenTwoNotes("A2", "C2")).to.equal(-9);
    });

    it("getDistanceBetweenTwoNotes() should return the distance (same)", function() {
        expect(noteMgr.getDistanceBetweenTwoNotes("A2", "A2")).to.equal(0);
    });

    it("getClosestNoteNameFromPitch() should find the name with exact input", function() {
        var freqC0 = 16.352;
        expect(noteMgr.getClosestNoteNameFromPitch(freqC0)).to.equal("C0");
    });

    it("getClosestNoteNameFromPitch() should be accurate when frequency <= 50 cents off", function() {
        // NOTE: 50 cents equals .5 semitone
        var sharpA7Freq = 3623.1;
        expect(noteMgr.getClosestFreqFromPitch(sharpA7Freq)).to.equal(3520.0);
        var flatA1Freq = 53.435;
        expect(noteMgr.getClosestFreqFromPitch(flatA1Freq)).to.equal(55.000);
    });

    describe('getCentsDiff()', function() {
        beforeEach(function(){
            this.Bb1 = "Bb1";
        });

        it("should return zero cents for perfect pitch", function () {
            var incomingFreq = 58.270;
            expect(noteMgr.getCentsDiff(incomingFreq, this.Bb1)).to.equal(0);
        });

        it("should give zero for near perfect pitch (slightly flat)", function () {
            expect(noteMgr.getCentsDiff(58.260, this.Bb1)).to.equal(0);
        });

        it("should give zero for near perfect pitch (slightly sharp)", function () {
            expect(noteMgr.getCentsDiff(58.285, this.Bb1)).to.equal(0);
        });

        it("should give null for diff = 1 semitone flat", function () {
            expect(noteMgr.getCentsDiff(55.000, this.Bb1)).to.be.a('null');
        });

        it("should give null for diff > 1 semitone flat", function () {
            expect(noteMgr.getCentsDiff(54.000, this.Bb1)).to.be.a('null');
        });

        it("should give null for diff slightly less than 1 semitone sharp", function () {
            expect(noteMgr.getCentsDiff(60.735, this.Bb1)).to.be.a('null');
        });

        it("should give null for diff > 1 semitone sharp", function () {
            expect(noteMgr.getCentsDiff(62, this.Bb1)).to.be.a('null');
        });

        it("should throw an error for flat notes below C0", function () {
            var errMsg = "getCentsDiff(): the frequency is outside the threshold - Fq:16.351";
            expect(catchError("getCentsDiff", [16.351, 'C7'], noteMgr)).to.equal(errMsg);
        });

        it("should throw an error for sharp notes above B8", function () {
            var errMsg = "getCentsDiff(): the frequency is outside the threshold - Fq:7902.2";
            expect(catchError("getCentsDiff", [7902.2, 'B8'], noteMgr)).to.equal(errMsg);
        });

        it("should calculate accurately when frequency <= 50 cents off", function () {
            // 3226.9 is 49 cents above the high cutoff
            expect(noteMgr.getCentsDiff(3226.9, 'G7')).to.equal(49);
            // 53.450 is -49 cents below A1 (low freq cutoff)50 cents below A1 (low freq cutoff)
            expect(noteMgr.getCentsDiff(53.450, 'A1')).to.equal(-49);
            // there is .31 unaccounted for between these edges of 49
            expect(noteMgr.getCentsDiff(427.65, 'A4')).to.equal(-49);
            expect(noteMgr.getCentsDiff(427.34, 'Ab4')).to.equal(49);
            // the 50 cent overlaps in mysterious ways -- .23 overlap of the 50
            expect(noteMgr.getCentsDiff(427.36, 'A4')).to.equal(-50);
            expect(noteMgr.getCentsDiff(427.59, 'Ab4')).to.equal(50);
        });

    });

});
