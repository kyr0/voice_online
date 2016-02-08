"use strict";
var nMgr = require("../../../src/browser/js/NoteManager.js");
var Lesson = require("../../../src/browser/js/Lesson.js");

function LessonPlayer(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new Error('LessonPlayer(): User range must be same size or smaller than lesson range.');
    }

    var startTime = null;
    var timerLength = null;
    var beatLength = null;
    var baseSet = null;
    var curSetIdx = 0;
    var elapsedBeats = 0;
    var minute = 60000;
    var bpm = aLesson.bpm;
    var isPlaying = false;
    var measureCount = aLesson.notes.length;
    var numBeats = measureCount * aLesson.tempo;
    var baseDistance = nMgr.getDistanceBetweenTwoNotes(aLesson.getLowestNote().name, aUser.bottomNote.name);

    function _transposeLesson(distance, baseLesson){
        var newNotes = [];
        for(var note = 0; note < baseLesson.notes.length; note++){
            var newNoteName = baseLesson.notes[note].transpose(distance);
            var noteLength = baseLesson.notes[note].noteLength;
            newNotes.push([newNoteName, noteLength]);
        }
        return new Lesson(newNotes);
    }

    // eg. (60sec / 120bpm) * 10beats = 5 seconds
    // TODO THERE IS A BUG, IT TAKES AS LONG FOR 4 BEAT AS 12 SAME BPM
    // TODO ADD INTEGRATED TEST TO CHECK THAT MS IS RIGHT FOR MORE NOTES
    function _beginTimer(numBeats, bpm){
        timerLength = numBeats * (minute / bpm);
        beatLength = timerLength / numBeats;
        startTime = new Date().getTime();
        setTimeout(_instance, beatLength);
    }

    function _instance(){
        if (_curSetPctComplete() >= 1) {
            console.log("Set " + curSetIdx + " complete.");
            curSetIdx++;
            if (curSetIdx < sets.length) {
                _beginTimer(numBeats, bpm);
            }
            else {
                isPlaying = false;
            }
        }
        else {
            _onInstance();
            var diff = (new Date().getTime() - startTime) - (elapsedBeats * beatLength);
            setTimeout(_instance, (beatLength - diff));
        }
    }

    function _onInstance(){}

    function _generateSets(){
        var sets = [];
        sets.push(baseSet);
        var setCount = nMgr.getDistanceBetweenTwoNotes(baseSet.getHighestNote().name, aUser.topNote.name) + 1;
        for (var set = 1; set < setCount; set++){
            sets.push(_transposeLesson(set, baseSet));
        }
        return sets;
    }

    function _curSetPctComplete(){
        // the result of this function has 1 ms of latency
        var elapsedTime = (new Date().getTime() - startTime);
        return elapsedTime / timerLength;
    }

    this._setCurSetIndex = function(newCurIdx){
        /**
         * If you are using this outside of tests you are doing something wrong.
         */
        curSetIdx = newCurIdx;
    };

    this.start = function(){
        _beginTimer(numBeats, bpm);
        isPlaying = true;
    };

    this.getCurSetPctComplete = function(){
        return _curSetPctComplete();
    };

    this.getCurrentSet = function(){
        return sets[curSetIdx];
    };

    this.isPlaying = function(){
        return isPlaying;
    };

    baseSet = _transposeLesson(baseDistance, aLesson);
    var sets = _generateSets();
}

module.exports = LessonPlayer;
