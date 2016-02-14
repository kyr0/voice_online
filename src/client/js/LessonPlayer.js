"use strict";
var nMgr = require("../../../src/client/js/NoteManager.js");
var Lesson = require("../../../src/client/js/Lesson.js");

function LessonPlayer(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new Error('LessonPlayer(): User range must be same size or smaller than lesson range.');
    }

    var startTime = null;
    var timerLength = null;
    var curNoteLength = null;
    var baseSet = null;
    var curSetIdx = 0;
    var curNoteIdx = 0;
    var curNote = null;
    var minute = 60000;
    var bpm = aLesson.bpm;
    var isPlaying = false;
    var measureCount = aLesson.getLessonLength();
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
    // TODO there is variability in set execution by ~50ms, reduce to ~5
    // TODO the _onInstance stops firing on time after a few sets, review original beatSync article
    // TODO find a way to keep it in sync, maybe smaller intervals with counters
    function _beginTimer(beatCount, bpm){
        timerLength = beatCount * (minute / bpm);
        curNote = sets[curSetIdx].notes[curNoteIdx];
        curNoteLength = curNote.relativeLength * (timerLength / measureCount);
        startTime = new Date().getTime();
        setTimeout(_instance, curNoteLength);
    }

    function _instance(){
        if (_curSetPctComplete() >= 1) {
            console.log("Set " + curSetIdx + " complete.");
            console.log("Milliseconds passed: " + (new Date().getTime() - startTime));
            curSetIdx++;
            curNoteIdx = 0;
            if (curSetIdx < sets.length) {
                _beginTimer(numBeats, bpm);
            }
            else {
                isPlaying = false;
            }
        }
        else {
            curNoteIdx++;
            _onInstance();
            curNoteLength = curNote.relativeLength * (timerLength / measureCount);
            setTimeout(_instance, curNoteLength);
        }
    }

    function _onInstance(){
        console.log("ONINSTANCE");
        curNote = sets[curSetIdx].notes[curNoteIdx];
        window.oscillator.frequency.value = curNote.frequency;
    }

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
         * This method only for use by tests
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

    this.getCurrentNote = function(){
        return curNote;
    };

    this.isPlaying = function(){
        return isPlaying;
    };

    baseSet = _transposeLesson(baseDistance, aLesson);
    var sets = _generateSets();
}

module.exports = LessonPlayer;
