
"use strict";

    var Lesson = require("../../src/browser/js/Lesson.js");


describe('Lesson constructor given note list', function() {
    beforeEach(function () {
        var arrayList = [["B2", "1/8"], ["A2", "1/2"], ["B2", "1/4"], ["B2", "1/32"]];
        this.lesson = new Lesson(arrayList);
    });

    it('should get correct length', function () {
        expect(this.lesson.getLessonLength()).to.equal("29/32");
    });
    it('should get correct range', function () {
        expect(this.lesson.getLessonRange()).to.equal(2);
    });
    it('should have the right number of notes', function () {
        expect(this.lesson.notes.length).to.equal(4);
    });
    it('should have the right number of intervals', function () {
        expect(this.lesson.intervals.length).to.equal(3);
    });
});


describe('Lesson', function() {
    beforeEach(function () {
        this.lesson = new Lesson();
    });

    it('should have default bpm of 120', function () {
        expect(this.lesson.bpm).to.equal(120);
    });

    it('should be able to set its BPM speed', function () {
        this.lesson.bpm = 130;
        expect(this.lesson.bpm).to.equal(130);
    });

    it("_getDenominator() should retrieve the length denominator of a single note", function () {
        expect(this.lesson.__testonly__.getDenominator("11/16")).to.equal("16");
    });

    it("_getNumerator() should retrieve the length numerator of a single note", function () {
        expect(this.lesson.__testonly__.getNumerator("11/16")).to.equal("11");
    });

    it("_sumNumeratorToHighestDenominator() should retrieve the converted numerator", function () {
        expect(this.lesson.__testonly__.sumNumeratorToHighestDenominator("1/4", 32)).to.equal(8);
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
            expect(this.lesson.getLessonLength()).to.equal('63/32');
        });

        it('should always have the intervals of all the notes it contains', function () {
            expect(this.lesson.intervals.length).to.equal(5);
        });

        it('should always know the lowest note it contains', function () {
            expect(this.lesson.__testonly__.getLowestNote().name).to.equal("A1");
            this.lesson.addNotes([["C0","1/16"],["Ab1","1/32"]]);
            expect(this.lesson.__testonly__.getLowestNote().name).to.equal("C0");
        });

        it('should always know the highest note it contains', function () {
            expect(this.lesson.__testonly__.getHighestNote().name).to.equal("C4");
            this.lesson.addNotes([["C5","1/16"],["B4","1/32"]]);
            expect(this.lesson.__testonly__.getHighestNote().name).to.equal("C5");
        });

        it('should always know the full range of the notes it contains', function () {
            expect(this.lesson.getLessonRange()).to.equal(27);
        });

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
            var arrayList = [["B2","1/8"],["A1","1/2"],["Db3","1/4"],["B2","1/32"]];
            var fromArray = this.lesson.__testonly__._createListOfNoteObjects(arrayList);
            compareNoteLists(fromArray, this.expectedList);
        });

        it("passed to _getHighestDenominator() should return the highest denominator", function () {
            expect(this.lesson.__testonly__.getHighestDenominator(this.lesson.notes)).to.equal(32);
        });

        it("getCombinedNoteLength() should return the combined length from a list of notes", function () {
            expect(this.lesson.getLessonLength(this.actualList)).to.equal("29/32");
        });

        it("createListOfIntervalsFromNotes() should return an accurate list", function () {
            expect(this.lesson.intervals.length).to.equal(3);
        });


    });

});


function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).to.equal(expectedList[i].name);
        expect(noteList[i].noteLength).to.equal(expectedList[i].noteLength);
    }
}