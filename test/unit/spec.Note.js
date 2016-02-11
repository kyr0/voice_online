///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var Note = require("../../src/client/js/Note.js");
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
        expect(noteObj.name).to.equal(this.noteName);
        expect(noteObj.noteLength).to.equal(expectNoteLength);
        expect(noteObj.frequency).to.equal(expectFrequency);
    });

    it('should set length when passed in to constructor', function () {
        var noteLength = "1/8";
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).to.equal(noteLength);
    });

    it('should convert length of "1" to a note using a length of "1/1"', function () {
        var noteLength = "1";
        var expectedNoteObj = { name : this.noteName, noteLength : "1/1" };
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).to.equal(expectedNoteObj.noteLength  );
    });

    it('should transpose the note accurately (up)', function () {
        var noteObj = new Note(this.noteName);
        expect(noteObj.transpose(35)).to.equal("Bb5");
    });

    it('should transpose the note accurately (down)', function () {
        var noteObj = new Note(this.noteName);
        expect(noteObj.transpose(-12)).to.equal("B1");
    });

    it('should transpose the note accurately (zero)', function () {
        var noteObj = new Note(this.noteName);
        expect(noteObj.transpose(0)).to.equal("B2");
    });

describe('Note Object', function() {

    it('should accept a note length longer than a full measure', function () {
        var expectLength = "2/1";
        var noteObj = new Note("A2", "2");
        expect(noteObj.noteLength).to.equal(expectLength);
    });

    it('should accept any multiple of a full measure', function () {
        var expectLength = "200/1";
        var noteObj = new Note("A2", "200");
        expect(noteObj.noteLength).to.equal(expectLength);
    });

    it('should accept a note length where numerator > 1 ', function () {
        var expectLength = "3/32";
        var noteObj = new Note("A2", "3/32");
        expect(noteObj.noteLength).to.equal(expectLength);
    });

});

describe('should throw an error when', function() {

    beforeEach(function() {
        this.createNote = function (name, noteLength) {
            return new Note(name, noteLength)
        };
    });

    it('attempting to create a note with invalid length (invalid numerator)', function () {
        var noteLength = "random/4";
        var errMsg = "Note(): the supplied note length is invalid: " + noteLength;
        expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
    });

    it('attempting to create a note with invalid length (invalid denominator)', function () {
        var noteLength = "1/stuff";
        var errMsg = "Note(): the supplied note length is invalid: " + noteLength;
        expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
    });

    it('attempting to create a note with invalid length (string)', function () {
        var noteLength = "random";
        var errMsg = "Note(): the supplied note length is invalid: " + noteLength;
        expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
    });

    it('attempting to create a note with invalid length (array)', function () {
        var noteLength = ["random", 4];
        var errMsg = "Note(): the supplied note length is invalid: " + noteLength;
        expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
    });

});

});
