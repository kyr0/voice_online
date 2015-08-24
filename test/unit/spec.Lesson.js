
"use strict";

var Lesson = require("../../src/browser/js/Lesson.js");

describe('Lesson', function() {
    beforeEach(function () {
        this.lesson = new Lesson();
    });

    it('should have default bpm of 120', function () {
        expect(this.lesson.bpm).toEqual(120);
    });

    it('should be able to set its BPM speed', function () {
        this.lesson.bpm = 130;
        expect(this.lesson.bpm).toEqual(130);
    });

    it("_getDenominator() should retrieve the length denominator of a single note", function () {
        expect(this.lesson.__testonly__.getDenominator("11/16")).toBe("16");
    });

    it("_getNumerator() should retrieve the length numerator of a single note", function () {
        expect(this.lesson.__testonly__.getNumerator("11/16")).toBe("11");
    });

    it("_sumNumeratorToHighestDenominator() should retrieve the converted numerator", function () {
        expect(this.lesson.__testonly__.sumNumeratorToHighestDenominator("1/4", 32)).toBe(8);
    });


    describe('with multiple notes', function() {
        beforeEach(function () {
            this.newNotes = [
                {name: "B2", noteLength: "1/8"},
                {name: "A1", noteLength: "1/2"},
                {name: "Db3", noteLength: "1/4"},
                {name: "B2", noteLength: "1"}
            ];
            this.lesson.addNotes(this.newNotes);
            this.lesson.addNotes([["B3","1/16"],["C4","1/32"]]);
        });

        it('should always know the combined length of all the notes it contains', function () {
            expect(this.lesson.getLessonLength()).toEqual('63/32');
        });

        it('should always have the intervals of all the notes it contains', function () {
            expect(this.lesson.intervals.length).toEqual(5);

        });

        //it('should always know the full range of the notes it contains', function () {
        //    expect(this.lesson.getLessonRange()).toEqual(52);
        //});

    });

    describe('with multiple notes', function () {
        beforeEach(function () {
            this.createTheseNotes = [
                {name: "B2", noteLength: "1/8"},
                {name: "A1", noteLength: "1/2"},
                {name: "Db3", noteLength: "1/4"},
                {name: "B2", noteLength: "1/32"}
            ];
            this.expectedList = [
                {name: "B2", noteLength: "1/8"},
                {name: "A1", noteLength: "1/2"},
                {name: "Db3", noteLength: "1/4"},
                {name: "B2", noteLength: "1/32"}
            ];
            this.actualList = this.lesson.addNotes(this.createTheseNotes);
        });

        it('can be created at once with object literal notation', function () {
            compareNoteLists(this.lesson.notes, this.expectedList);
        });

        it('can be created at once with nested arrays', function () {
            var arrayList = [
                ["B2","1/8"],["A1","1/2"],["Db3","1/4"],["B2","1/32"]
            ];
            var fromArray = this.lesson.__testonly__.createListOfNoteObjects(arrayList);
            compareNoteLists(fromArray, this.expectedList);
        });

        it("passed to _getHighestDenominator() should return the highest denominator", function () {
            expect(this.lesson.__testonly__.getHighestDenominator(this.lesson.notes)).toBe(32);
        });

        it("getCombinedNoteLength() should return the combined length from a list of notes", function () {
            expect(this.lesson.getLessonLength(this.actualList)).toBe("29/32");
        });

        it("createListOfIntervalsFromNotes() should return an accurate list", function () {
            expect(this.lesson.intervals.length).toBe(3);
        });


    });

});


function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).toEqual(expectedList[i].name);
        expect(noteList[i].noteLength).toEqual(expectedList[i].noteLength);
    }
}