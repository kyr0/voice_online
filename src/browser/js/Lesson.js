
"use strict";
var Note = require("./Note.js");
var Interval = require("./Interval.js");
var noteMgr = require("./NoteManager.js");

function Lesson () {
    this.notes = [];
    this.intervals = [];
    this.bpm = 120;
    this.range = null;  // is an Interval Object

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


    function _createListOfNoteObjects(newNotes) {
        var noteObjArr = [];
        var name;
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
            noteObjArr.push(new Note(name, noteLength));
        }
        return noteObjArr;
    }
    /* start-test-code */
    this.__testonly__.createListOfNoteObjects = _createListOfNoteObjects;
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


    this.addNotes = function(newNotes) {
        var noteObjArr = _createListOfNoteObjects(newNotes);
        this.notes = this.notes.concat(noteObjArr);
        this.intervals = _updateIntervals(this.notes);
    };


    this.getLessonLength = function() {
        var arrayOfNotes = this.notes;
        var highestDenom = _getHighestDenominator(arrayOfNotes);
        var numerator = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var noteLength = arrayOfNotes[i].noteLength;
            numerator += _sumNumeratorToHighestDenominator(noteLength, highestDenom);
        }
        return numerator + "/" + highestDenom;
    };

    this.getLessonRange = function() {

    };

}

module.exports = Lesson;