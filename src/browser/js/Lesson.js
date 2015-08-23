
"use strict";

var noteMgr = require("./NoteManager.js");

function Lesson () {
    this.notes = [];
    this.bpm = 120;
    this.range = "";

    this.addNotes = function(newNotes) {
        var noteObjArr = noteMgr.createListOfNoteObjects(newNotes);
        this.notes = this.notes.concat(noteObjArr);
    };

    this.countNoteObjects = function() {
        return this.notes.noteLength;
    };

    this.getLessonLength = function() {
        return noteMgr.getCombinedNoteLength(this.notes);
    };

}

module.exports = Lesson;