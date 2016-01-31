
"use strict";

var NoteMaps = require("./NoteMaps.js");

function Note (name, noteLength) {

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

        if ((newNoteLength.indexOf("/") == -1) ||
            (isNaN(_getDenominator(newNoteLength))) ||
            (isNaN(_getNumerator(newNoteLength))))
        {
            throw new Error('Note(): the supplied note length is invalid: ' + noteLength);
        }
        return newNoteLength;
    };

    this.name = nMaps.validateNoteName(name);
    this.noteLength = this.setNoteLength(noteLength);
    var _noteMap = nMaps.pitchMap[this.name];
    this.previousNote = _noteMap.previousNote;
    this.nextNote = _noteMap.nextNote;
    this.frequency = _noteMap.frequency;

}

module.exports = Note;





