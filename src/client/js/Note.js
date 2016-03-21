'use strict';

var NoteMaps = require('./NoteMaps.js');
var InvalidLengthError = require('./customErrors.js').InvalidLengthError;


function Note (name, noteLength){

    var nMaps = new NoteMaps();

    this.setNoteLength = function(noteLength){

        function _getDenominator(nLen){
            return nLen.split('/')[1];
        }
        function _getNumerator(nLen){
            return nLen.split('/')[0];
        }

        var newNoteLength = noteLength;

        // handle whole numbers eg. 1, 2, 10
        if (!isNaN(noteLength)) newNoteLength = noteLength + '/1';
        else if (typeof noteLength === 'undefined') newNoteLength = '1/1';

        if ((newNoteLength.indexOf('/') === -1) ||
            (isNaN(_getDenominator(newNoteLength))) ||
            (isNaN(_getNumerator(newNoteLength))))
        {
            throw new InvalidLengthError('The supplied length is invalid: ' + noteLength);
        }
        return newNoteLength;
    };

    this.transpose = function(distance){
        var newIndex = distance + nMaps.pitchMap[this.name].index;
        return nMaps.pitchArray[newIndex].name;
    };

    this.getDistanceToNote = function(otherNtName) {
        var direction = null;
        var startFreq = _noteObj.frequency;
        var endFreq = nMaps.pitchMap[otherNtName].frequency;

        if (startFreq === endFreq){
            direction = 'none';
        }
        else if (startFreq < endFreq) {
            direction = 'up';
        }
        else {
            direction = 'down';
        }

        var halfSteps = 0;
        var stepTo = null;
        var reverseSteps = 1;
        var traversalNote = _noteObj;

        if (direction === 'none') {
            return halfSteps;
        }
        else if (direction === 'down') {
            stepTo = 'previousNote';
            reverseSteps = -1;
        }
        else {
            stepTo = 'nextNote';
        }
        while (traversalNote.name !== otherNtName){
            halfSteps += 1;
            if (traversalNote[stepTo] === null) {
                throw new Error ('getDistanceToNote() did not encounter the end point of the interval. End Point: ' +
                    otherNtName);
            }
            else traversalNote = traversalNote[stepTo];
        }
        return halfSteps * reverseSteps;
    };

    // Returns the difference from expected pitch, rounded to the nearest cent
    this.getCentsDiff = function(incomingPitch){

        // Math.round instead of Math.floor allows pitch within .5 cent of
        //  intended note to be counted as 'perfect'
        var centsOff =  Math.round(1200 * Math.log(incomingPitch / this.frequency)/Math.log(2));

        // Don't return a value if more than .5 semitone off target
        if (Math.abs(centsOff) > 50) {
            return null;
        }
        return centsOff;
    };

    if (name === '-'){
        this.name = name;
        this.length = this.setNoteLength(noteLength);
        this.previousNote = null;
        this.nextNote = null;
        this.frequency = -1;
        this.transpose = function() { return name; };
        this.getCentsDiff = function() { return null; };
        this.getDistanceToNote = function() { return null; };
    }
    else {
        this.name = nMaps.validateNoteName(name);
        this.length = this.setNoteLength(noteLength);
        var _noteObj = nMaps.pitchMap[this.name];
        this.previousNote = _noteObj.previousNote;
        this.nextNote = _noteObj.nextNote;
        this.frequency = _noteObj.frequency;
    }
}

module.exports = Note;





