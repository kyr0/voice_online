
"use strict";

function Note (name, noteLength) {
    var _noteLengths = [ '1/32', '1/16', '1/8', '1/4', '1/2', '1/1'];

    if (noteLength === '1' || typeof noteLength === 'undefined') noteLength = '1/1';

    var isLengthParamValid = false;

    for (var i = 0; i < _noteLengths.length; i++){
        if (noteLength === _noteLengths[i]) {
            isLengthParamValid = true;
            break;
        }
    }

    if (!isLengthParamValid)
        throw new Error("Note(): the supplied note length is invalid - " + noteLength);

    this.name = name;
    this.noteLength = noteLength;

    var _validateNoteCreationParameters = function(notes){};

    return this;
}

module.exports = Note;