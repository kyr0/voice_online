"use strict";
var Note = require("./Note.js");
var Interval = require("./Interval.js");

function Lesson (noteList) {

    this.notes = [];
    this.intervals = [];
    this.bpm = 120;
    this.tempo = 4; // beats per measure
    this.smallestNoteSize = null;
    var lowestNote = null;
    var highestNote = null;

    function _getDenominator(noteLength){
        return noteLength.split('/')[1];
    }
    /* start-test-code */
    this.__testonly__ = {};
    this.__testonly__.getDenominator = _getDenominator;
    /* end-test-code */


    function _getNumerator(noteLength){
        return noteLength.split('/')[0];
    }
    /* start-test-code */
    this.__testonly__.getNumerator = _getNumerator;
    /* end-test-code */

    function _getHighestDenominator(arrayOfNotes){
        var highestDenom = 0;
        var currentDenom;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            currentDenom = Number(_getDenominator(arrayOfNotes[i].noteLength));
            if (currentDenom > highestDenom) highestDenom = currentDenom;
        }
        return highestDenom;
    }
    /* start-test-code */
    this.__testonly__.getHighestDenominator = _getHighestDenominator;
    /* end-test-code */

    function _sumNumeratorToHighestDenominator(noteLength, highestDenom){
        var numerator = _getNumerator(noteLength);
        var denominator = _getDenominator(noteLength);
        while (denominator < highestDenom) {
            numerator *= 2;
            denominator *= 2;
        }
        return Number(numerator);
    }
    /* start-test-code */
    this.__testonly__.sumNumeratorToHighestDenominator = _sumNumeratorToHighestDenominator;
    /* end-test-code */

    function _setRangeDelimiters(note) {
        if (lowestNote === null) {
            lowestNote = note;
        }
        if (highestNote === null) {
            highestNote = note;
        }
        if (note.frequency < lowestNote.frequency) {
            lowestNote = note;
        }
        else if (note.frequency > highestNote.frequency) {
            highestNote = note;
        }
    }

    function _createListOfNoteObjects(newNotes) {
        var noteObjArr = [];
        var name;
        var newNoteObj;
        var noteLength;
        for (var i = 0; i < newNotes.length; i++) {
            if (newNotes[i].constructor === Array){
                name = newNotes[i][0];
                noteLength = newNotes[i][1];
            }
            else if (typeof newNotes[i].name !== 'undefined'){
                name = newNotes[i].name;
                noteLength = newNotes[i].noteLength;
            }
            newNoteObj = new Note(name, noteLength);
            newNoteObj.relativeLength = _getRelativeNoteLength(newNoteObj);
            noteObjArr.push(newNoteObj);
            _setRangeDelimiters(newNoteObj);
        }
        return noteObjArr;
    }
    /* start-test-code */
    this.__testonly__._createListOfNoteObjects = _createListOfNoteObjects;
    /* end-test-code */


    var _updateIntervals = function (noteArr){
        var itvlObjArr = [];
        for (var i = 0; i < noteArr.length - 1; i++) {
            var startNote = noteArr[i].name;
            var endNote = noteArr[i + 1].name;
            itvlObjArr.push(new Interval(startNote, endNote));
        }
        return itvlObjArr;
    };

    this._updateRelativeIntervals = function (){
        /**
        Whenever notes are added the note is made aware of how far away it
        is from the highest note in the lesson.
         */
        for (var i = 0; i < this.notes.length; i++) {
            var intervalSteps = new Interval(this.notes[i].name, highestNote.name).halfsteps;
            this.notes[i].relativeInterval = intervalSteps;
        }
    };

    var _getRelativeNoteLength = function (noteObj){
        /**
        Whenever notes are added the note is made aware of how long it
        is compared to the length of a measure.
         */
        var num = _getNumerator(noteObj.noteLength);
        var den = _getDenominator(noteObj.noteLength);
        return (num / den);
    };

    this.getLowestNote = function(){return lowestNote;};
    this.getHighestNote = function(){return highestNote;};

    this.addNotes = function(newNotes) {
        var noteObjArr = _createListOfNoteObjects(newNotes);
        this.notes = this.notes.concat(noteObjArr);
        this.intervals = _updateIntervals(this.notes);
        this._updateRelativeIntervals();
        this.smallestNoteSize = _getHighestDenominator(this.notes);
    };


    this.getLessonLength = function (){
        /**
         * Returns a float, # of measures
         */

        var arrayOfNotes = this.notes;
        var highestDenom = this.smallestNoteSize;
        var numerator = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var noteLength = arrayOfNotes[i].noteLength;
            // TODO handle odd time signatures eg. 5/7 and find common denominator
            numerator += _sumNumeratorToHighestDenominator(noteLength, highestDenom);
        }
        return numerator / highestDenom;
    };

    this.getSmallestNoteSize = function() {
        return smallestNoteSize;
    };

    this.getLessonRange = function() {
        var range = new Interval(lowestNote.name, highestNote.name);
        return range.halfsteps;
    };

    if (typeof noteList !== 'undefined') {
        this.addNotes(noteList);
    }

}

module.exports = Lesson;