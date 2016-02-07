"use strict";
var nMgr = require("../../../src/browser/js/NoteManager.js");
var Lesson = require("../../../src/browser/js/Lesson.js");

function LessonPlayer(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new Error('LessonPlayer(): User range must be same size or smaller than lesson range.');
    }
    // Beat Timer variables
    var startTime = null;
    var timerLength = null;
    var minute = 60000;

    var baseDistance = nMgr.getDistanceBetweenTwoNotes(aLesson.getLowestNote().name, aUser.bottomNote.name);
    var bpm = aLesson.bpm;
    var measureCount = aLesson.notes.length;
    var numBeats = measureCount * aLesson.tempo;

    function _transposeLesson(distance){
        var newNotes = [];
        for(var note = 0; note < aLesson.notes.length; note++){
            var newNoteName = aLesson.notes[note].transpose(distance);
            var noteLength = aLesson.notes[note].noteLength;
            newNotes.push([newNoteName, noteLength]);
        }
        return new Lesson(newNotes);
    }

    // eg. (60sec / 120bpm) * 10beats = 5 seconds
    function _beginTimer(numBeats, bpm){
        var beatLength = timerLength / numBeats,
            elapsedBeats = 0;
        timerLength = numBeats * (minute / bpm);

        function _instance(){
            if (elapsedBeats++ === numBeats) {
                _onComplete();
            }
            else {
                _onInstance();

                var diff = (new Date().getTime() - startTime) - (elapsedBeats * beatLength);
                setTimeout(_instance, (beatLength - diff));
            }
        }

        startTime = new Date().getTime();
        setTimeout(_instance, beatLength);
    }

    function _onComplete(){}

    function _onInstance(){}

    this.start = function(){
        _beginTimer(numBeats, bpm);
    };

    this.getCurSetPctComplete = function(){
        // the result of this function has 1 ms of latency
        var elapsedTime = (new Date().getTime() - startTime);
        return elapsedTime / timerLength;
    };

    this.currentSet = _transposeLesson(baseDistance);

}

module.exports = LessonPlayer;
