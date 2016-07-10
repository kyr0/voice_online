'use strict';

var Note = require('./Note.js');

function Caption (captionText, captionDuration){

    this.setCaptionDuration = function(captionDuration){

        var tmpNote = new Note('-', captionDuration);
        return tmpNote.duration;
    };

    this.text = captionText;
    this.duration = this.setCaptionDuration(captionDuration);
}

module.exports = Caption;





