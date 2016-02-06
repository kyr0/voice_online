"use strict";
var Interval = require("./Interval.js");

function User (bottom, top) {

    var range = new Interval(bottom, top);
    if (range.halfsteps < 6) {
        throw new Error ("User(): top note must be at least 6 semitones higher than bottom note.");
    }
    this.bottomNote = range.startNote;
    this.topNote = range.endNote;
    this.range = range.halfsteps;
}

module.exports = User;