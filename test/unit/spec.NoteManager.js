
"use strict";

var noteMgr = require("../../src/browser/js/NoteManager.js");

describe('Note Management library', function() {

    describe('multiple notes', function() {
        beforeEach(function() {
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

        it("passed to _getHighestDenominator() should return the highest denominator", function() {
            expect(noteMgr.__testonly__getHighestDenominator(this.actualList)).toBe("8");
        });

        it("getCombinedNoteLength() should return the combined length from a list of notes", function() {
            expect(noteMgr.getCombinedNoteLength(this.actualList)).toBe("15/8");
        });
    });

    it("_getDenominator() should retrieve the length denominator of a single note", function() {
        expect(noteMgr.__testonly__getDenominator("11/16")).toBe("16");
    });

    it("_getNumerator() should retrieve the length numerator of a single note", function() {
        expect(noteMgr.__testonly__getNumerator("11/16")).toBe("11");
    });

    it("_convertNumeratorToHighestDenominator() should retrieve the converted numerator", function() {
        expect(noteMgr.__testonly__convertNumeratorToHighestDenominator("1/4", 32)).toBe(8);
    });


    //it("should allow creation of a single note", function() {});
    //it("should not allow incorrectly formatted notes to be created", function() {});

});

function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).toEqual(expectedList[i].name);
        expect(noteList[i].noteLength).toEqual(expectedList[i].noteLength);
    }
}
