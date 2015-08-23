
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

    function validateNoteName(noteName){
        try {
            if (typeof nMaps.pitchMap[noteName].name !== 'undefined') {
                return nMaps.pitchMap[noteName].name;
            }
        }
        catch (err) {
            throw new Error ("Note(): the supplied note name is invalid - " + noteName);
        }
    }

    this.name = validateNoteName(name);
    this.noteLength = this.setNoteLength(noteLength);
    this.frequency = nMaps.pitchMap[this.name].frequency;

}

module.exports = Note;





