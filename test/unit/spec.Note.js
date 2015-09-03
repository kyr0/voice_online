///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var Note = require("../../src/browser/js/Note.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('Note Object', function() {

    beforeEach(function() {
        this.noteName = "B2";
    });

    it('should have passed in name, related frequency, and default length of 1/1', function () {
        var expectNoteLength = "1/1";
        var expectFrequency = 123.47;
        var noteObj = new Note(this.noteName);
        expect(noteObj.name).toBe(this.noteName);
        expect(noteObj.noteLength).toBe(expectNoteLength);
        expect(noteObj.frequency).toBe(expectFrequency);
    });

    it('should set length when passed in to constructor', function () {
        var noteLength = "1/8";
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).toBe(noteLength);
    });

    it('should convert length of "1" to a note using a length of "1/1"', function () {
        var noteLength = "1";
        var expectedNoteObj = { name : this.noteName, noteLength : "1/1" };
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).toBe(expectedNoteObj.noteLength  );
    });

    describe('should throw an error when', function() {

        beforeEach(function() {
            this.createNote = function (name, noteLength) {
                new Note(name, noteLength)
            };
        });

        it('attempting to create a note with invalid length (1/6)', function () {
            var noteLength = "1/6";
            var errMsg = "Note(): the supplied note length is invalid - " + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).toEqual(errMsg);
        });

        it('attempting to create a note with invalid length (invalid type)', function () {
            var noteLength = ["random", "stuff"];
            var errMsg = "Note(): the supplied note length is invalid - " + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).toEqual(errMsg);
        });

    });



    //it('should have a frequency assigned to it', function () {});
    //it('should validate note name before creation', function () {});



});
