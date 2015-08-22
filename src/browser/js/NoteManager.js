"use strict";

/*
 *  Adapted from the TarsosDsP Java library for use in Javascript
 *
 */
var Note = require("./Note.js");

var NoteManager = (function() {

    function _getDenominator(noteLength){
        return noteLength.split('/')[1];
    }

    function _getNumerator(noteLength){
        return noteLength.split('/')[0];
    }

    function _getHighestDenominator(arrayOfNotes){
        var highestDenom = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var currentDenom = _getDenominator(arrayOfNotes[i].noteLength);
            if (currentDenom > highestDenom) highestDenom = currentDenom;
        }
        return highestDenom;
    }

    function _convertNumeratorToHighestDenominator(noteLength, highestDenom){
        var numerator = _getNumerator(noteLength);
        var denominator = _getDenominator(noteLength);
        while (denominator < highestDenom) {
            numerator *= 2;
            denominator *= 2;
        }
        return Number(numerator);
    }

    var publicGetCombinedNoteLength = function(arrayOfNotes){
        var highestDenom = _getHighestDenominator(arrayOfNotes);
        var numerator = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var noteLength = arrayOfNotes[i].noteLength;
            numerator += _convertNumeratorToHighestDenominator(noteLength, highestDenom);
        }
        return numerator + "/" + highestDenom;
    };

    var publicGetNoteObjectList = function(newNotes) {
        var noteObjArr = [];
        for (var i = 0; i < newNotes.length; i++) {
            var name = newNotes[i].name;
            var noteLength = newNotes[i].noteLength;
            noteObjArr.push(new Note(name, noteLength));
        }
        return noteObjArr;
    };

    var _getNoteObject = function(newNote) {
        return new Note(newNote);
    };

    return {
        getCombinedNoteLength : publicGetCombinedNoteLength,
        getNoteObjectList : publicGetNoteObjectList,
        /* start-test-code */
        __testonly__getDenominator : _getDenominator,
        __testonly__getNumerator : _getNumerator,
        __testonly__getHighestDenominator : _getHighestDenominator,
        __testonly__convertNumeratorToHighestDenominator : _convertNumeratorToHighestDenominator
        /* end-test-code */
    };

})();

module.exports = NoteManager;
