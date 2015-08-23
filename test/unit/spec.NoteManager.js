
"use strict";

var noteMgr = require("../../src/browser/js/NoteManager.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}


describe('Note Management library', function() {

    describe('multiple notes', function () {
        beforeEach(function () {
            this.createTheseNotes = [
                {name: "B2", noteLength: "1/8"},
                {name: "A1", noteLength: "1/2"},
                {name: "Db3", noteLength: "1/4"},
                {name: "B2", noteLength: "1/1"}
            ];
            this.actualList = noteMgr.getNoteObjectList(this.createTheseNotes);
        });

        it('can be created at once', function () {
            var expectedList = [
                {name: "B2", noteLength: "1/8"},
                {name: "A1", noteLength: "1/2"},
                {name: "Db3", noteLength: "1/4"},
                {name: "B2", noteLength: "1/1"}
            ];
            compareNoteLists(this.actualList, expectedList);
        });

        it("passed to _getHighestDenominator() should return the highest denominator", function () {
            expect(noteMgr.__testonly__getHighestDenominator(this.actualList)).toBe("8");
        });

        it("getCombinedNoteLength() should return the combined length from a list of notes", function () {
            expect(noteMgr.getCombinedNoteLength(this.actualList)).toBe("15/8");
        });
    });

    it("_getDenominator() should retrieve the length denominator of a single note", function () {
        expect(noteMgr.__testonly__getDenominator("11/16")).toBe("16");
    });

    it("_getNumerator() should retrieve the length numerator of a single note", function () {
        expect(noteMgr.__testonly__getNumerator("11/16")).toBe("11");
    });

    it("_convertNumeratorToHighestDenominator() should retrieve the converted numerator", function () {
        expect(noteMgr.__testonly__convertNumeratorToHighestDenominator("1/4", 32)).toBe(8);
    });
});

    //it("should allow creation of a single note", function() {});
    //it("should not allow incorrectly formatted notes to be created", function() {});

describe('Pitch Evaluation library', function() {
    var freqC0 = 16.352;

    it("note object should know its own name", function() {
        expect(noteMgr.getClosestNoteFromPitch(freqC0).name).toEqual("C0");
    });

    describe('getCentsDiff()', function() {
        beforeEach(function(){
            this.Gb0 = "Gb0";
        });

        it("should return zero cents for perfect pitch", function () {
            var incomingFreq = 23.125;
            expect(noteMgr.getCentsDiff(incomingFreq, this.Gb0)).toEqual(0);
        });

        it("should give zero for near perfect pitch (slightly flat)", function () {
            expect(noteMgr.getCentsDiff(23.119, this.Gb0)).toBe(0);
        });

        it("should give zero for near perfect pitch (slightly sharp)", function () {
            expect(noteMgr.getCentsDiff(23.130, this.Gb0)).toEqual(0);
        });

        it("should give null for diff = 1 semitone flat", function () {
            expect(noteMgr.getCentsDiff(21.827, this.Gb0)).toBeNull();
        });

        it("should give null for diff > 1 semitone flat", function () {
            expect(noteMgr.getCentsDiff(20, this.Gb0)).toBeNull();
        });

        it("should give null for diff = 1 semitone sharp", function () {
            expect(noteMgr.getCentsDiff(24.500, this.Gb0)).toBeNull();
        });

        it("should give null for diff > 1 semitone sharp", function () {
            expect(noteMgr.getCentsDiff(25, this.Gb0)).toBeNull();
        });

        it("should throw an error for flat notes below C0", function () {
            var errMsg = "getCentsDiff(): the frequency is outside the threshold - Fq:16.351";
            expect(catchError("getCentsDiff", [16.351, 'C7'], noteMgr)).toEqual(errMsg);
        });

        it("should throw an error for sharp notes above B8", function () {
            var errMsg = "getCentsDiff(): the frequency is outside the threshold - Fq:7902.2";
            expect(catchError("getCentsDiff", [7902.2, 'B8'], noteMgr)).toEqual(errMsg);
        });

        it("should calculate accurately when frequency <= 50 cents off", function () {
            // 3226.9 is 49 cents above the high cutoff
            expect(noteMgr.getCentsDiff(3226.9, 'G7')).toEqual(49);
            // 53.450 is -49 cents below A1 (low freq cutoff)50 cents below A1 (low freq cutoff)
            expect(noteMgr.getCentsDiff(53.450, 'A1')).toEqual(-49);
            // there is .31 unaccounted for between these edges of 49
            expect(noteMgr.getCentsDiff(427.65, 'A4')).toEqual(-49);
            expect(noteMgr.getCentsDiff(427.34, 'Ab4')).toEqual(49);
            // the 50 cent overlaps in mysterious ways -- .23 overlap of the 50
            expect(noteMgr.getCentsDiff(427.36, 'A4')).toEqual(-50);
            expect(noteMgr.getCentsDiff(427.59, 'Ab4')).toEqual(50);
        });


    });

    it("should be able to use frequencies to lookup note object", function() {
        var testFreq = noteMgr.__testonly__pMap.pitchArray[0];
        expect(noteMgr.__testonly__pMap.reverseMap[testFreq].name).toEqual("C0");
    });

    it("should be able to lookup note object when frequency <= 50 cents off", function() {
        // NOTE: 50 cents equals .5 semitone
        var sharpA7Freq = 3623.1;
        expect(noteMgr.getClosestFreqFromPitch(sharpA7Freq)).toEqual(noteMgr.getNoteByName("A7").frequency);
        var flatA1Freq = 53.435;
        expect(noteMgr.getClosestFreqFromPitch(flatA1Freq)).toEqual(noteMgr.getNoteByName("A1").frequency);
    });

});


function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).toEqual(expectedList[i].name);
        expect(noteList[i].noteLength).toEqual(expectedList[i].noteLength);
    }
}
