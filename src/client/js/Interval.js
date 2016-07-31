'use strict';

var Note = require('./Note.js');

function Interval (startNote, endNote) {

    this.startNote = startNote;
    this.endNote = endNote;
    var startNoteInstance = new Note(startNote);
    this.halfsteps = startNoteInstance.getDistanceToNote(endNote);
    // TODO refactor Interval names to reflect music theory 'minor 2nd' etc
    this.name = startNote + ':' + endNote;
}

module.exports = Interval;



