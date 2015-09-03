
"use strict";

var NoteMaps = require("./NoteMaps.js");

function Note (name, noteLength) {

    var nMaps = new NoteMaps();

    this.setNoteLength = function(noteLength){
        var _noteLengths = [ '1/32', '1/16', '1/8', '1/4', '1/2', '1/1'];
        var newNoteLength = noteLength;
        if (noteLength === '1' || typeof noteLength === 'undefined') newNoteLength = '1/1';

        var isLengthParamValid = false;
        for (var i = 0; i < _noteLengths.length; i++){
            if (newNoteLength === _noteLengths[i]) {
                isLengthParamValid = true;
                break;
            }
        }
        if (!isLengthParamValid)
            throw new Error("Note(): the supplied note length is invalid - " + noteLength);

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





