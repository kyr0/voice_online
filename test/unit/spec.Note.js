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

    it('should create a note with default length of 1/1', function () {
        var expectNoteLength = "1/1";
        var expectedNoteObj = { name : this.noteName, noteLength : expectNoteLength };
        var noteObj = new Note(this.noteName);
        expect(noteObj.name).toBe(expectedNoteObj.name);
        expect(noteObj.noteLength).toBe(expectedNoteObj.noteLength);
    });

    it('should create a note using name and length', function () {
        var noteLength = "1/8";
        var expectedNoteObj = { name : this.noteName, noteLength : noteLength };
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).toBe(expectedNoteObj.noteLength);
    });

    it('should convert length of "1" to a note using a length of "1/1"', function () {
        var noteLength = "1";
        var expectedNoteObj = { name : this.noteName, noteLength : "1/1" };
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).toBe(expectedNoteObj.noteLength  );
    });

    describe('should throw an error when attempting to create a note with invalid length', function() {

        beforeEach(function() {
            this.createNote = function (name, noteLength) {
                new Note(name, noteLength)
            };
        });

        it('(1/6)', function () {
            var noteLength = "1/6";
            var errMsg = "Note(): the supplied note length is invalid - " + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).toEqual(errMsg);
        });

        it('(invalid type)', function () {
            var noteLength = ["random", "stuff"];
            var errMsg = "Note(): the supplied note length is invalid - " + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).toEqual(errMsg);
        });
    });


    //it('should have a frequency assigned to it', function () {});
    //it('should validate note name before creation', function () {});



});
