"use strict";
var nMgr = require("../../../src/browser/js/NoteManager.js");
var Lesson = require("../../../src/browser/js/Lesson.js");

function LessonPlayer(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new Error('LessonPlayer(): User range must be same size or smaller than lesson range.');
    }

    var baseDistance = nMgr.getDistanceBetweenTwoNotes(aLesson.getLowestNote().name, aUser.bottomNote.name);

    function _transposeLesson(distance){
        var newNotes = [];
        for(var note = 0; note < aLesson.notes.length; note++){
            var newNoteName = aLesson.notes[note].transpose(distance);
            var noteLength = aLesson.notes[note].noteLength;
            newNotes.push([newNoteName, noteLength]);
        }
        return new Lesson(newNotes);
    }

    this.currentSet = _transposeLesson(baseDistance);
}

module.exports = LessonPlayer;
