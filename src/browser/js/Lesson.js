
"use strict";

var noteMgr = require("./NoteManager.js");

function Lesson () {
    this.notes = [];
    this.lessonLength = 0;
    this.bpm = 120;
    this.range = "";

    this.addNotes = function(newNotes) {
        var noteObjArr = noteMgr.getNoteObjectList(newNotes);
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