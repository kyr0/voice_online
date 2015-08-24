
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

    this.getLessonLength = function() {
        return noteMgr.getCombinedNoteLength(this.notes);
    };

    this.getLessonRange = function() {
        return noteMgr.getLargestInterval(this.notes);
    };

}

module.exports = Lesson;