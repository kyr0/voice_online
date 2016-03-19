'use strict';

var Note = require('./Note.js');
var InvalidIntervalError = require('./CustomErrors').InvalidIntervalError;

function Interval (startNote, endNote) {

    if (startNote === '-' || endNote === '-') {
        throw new InvalidIntervalError('Interval(): Silent notes not allowed in Interval.');
    }
    this.startNote = new Note(startNote);
    this.endNote = new Note(endNote);
    this.halfsteps = this.startNote.getDistanceToNote(this.endNote.name);
    // TODO refactor Interval names to reflect music theory 'minor 2nd' etc
    this.name = this.startNote.name + ':' + this.endNote.name;
}

module.exports = Interval;



