'use strict';

var Note = require('./Note.js');

function Caption (captionText, captionLength){

    this.setCaptionLength = function(captionLength){

        var tmpNote = new Note('-', captionLength);
        return tmpNote.length;
    };

    this.text = captionText;
    this.length = this.setCaptionLength(captionLength);
}

module.exports = Caption;





