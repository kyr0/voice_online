
"use strict";

var Note = require("./Note.js");

function Interval (startNote, endNote) {
    this.startNote = new Note(startNote);
    this.endNote = new Note(endNote);
    this.halfsteps = this.startNote.getDistanceToNote(this.endNote.name);
    // TODO refactor Interval names to reflect music theory 'minor 2nd' etc
    this.name = this.startNote.name + ":" + this.endNote.name;
}

module.exports = Interval;





