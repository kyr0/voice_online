
"use strict";

function Note (name, noteLength) {
    // TODO get rid of this next line
    var noteMgr = require("./NoteManager.js");  // I know this is ugly need to work it out

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
        return noteMgr.getNoteByName(noteName).name;
    }

    this.name = validateNoteName(name);
    this.noteLength = this.setNoteLength(noteLength);
    this.frequency = noteMgr.getNoteByName(this.name).frequency;

}

module.exports = Note;





