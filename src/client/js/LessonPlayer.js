"use strict";
var nMgr = require("../../../src/client/js/NoteManager.js");
var Lesson = require("../../../src/client/js/Lesson.js");

// TODO move audioContext setup / teardown into LessonPlayer Begin / End

function LessonPlayer(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new Error('LessonPlayer(): User range must be same size or smaller than lesson range.');
    }

    var startTime = null;
    var timerLength = null;
    var fragmentLength = null;
    var curNoteLength = null;
    var baseSet = null;
    var curSetIdx = 0;
    var curNoteIdx = 0;
    var elapsedFragments = 0;
    var lastNoteElapsedFragments = 0;
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
    // TODO 1) there is variability in set execution by ~50ms, reduce to ~5
    // TODO 2) find a way to test this properly (or even at all)
    function _beginTimer(beatCount, bpm){
        var curSet = sets[curSetIdx];
        timerLength = beatCount * (minute / bpm);
        var beatLength = timerLength / beatCount;
        fragmentLength = beatLength / (curSet.smallestNoteSize / curSet.tempo);
        curNote = curSet.notes[curNoteIdx];
        curNoteLength = curNote.relativeLength * (timerLength / measureCount);
        startTime = new Date().getTime();
        setTimeout(_instance, fragmentLength);
    }

    function _instance(){
        elapsedFragments++;
        if (_curSetPctComplete() >= 1) {
            console.log("Set " + curSetIdx + " complete.");
            console.log("Milliseconds passed: " + (new Date().getTime() - startTime));
            curSetIdx++;
            if (curSetIdx < sets.length) {
                curNoteIdx = 0;
                curNote = sets[curSetIdx].notes[curNoteIdx];
                curNoteLength = curNote.relativeLength * (timerLength / measureCount);
                console.log("New Note: " + curNote.name + " " + curNote.frequency);
                window.oscillator.frequency.value = curNote.frequency;
                elapsedFragments = 0;
                lastNoteElapsedFragments = 0;
                _beginTimer(numBeats, bpm);
            }
            else {
                isPlaying = false;
            }
        }
        else {
            _onInstance();
            // the diff resets latency which occurs during timer to keep it on track
            var diff = (new Date().getTime() - startTime) - (elapsedFragments * fragmentLength);
            setTimeout(_instance, (fragmentLength - diff));
        }
    }

    function _onInstance(){
        var elapsedInCurrentNote = (elapsedFragments - lastNoteElapsedFragments) * fragmentLength;
        if (curNoteLength <= elapsedInCurrentNote){
            lastNoteElapsedFragments = elapsedFragments;
            curNoteIdx++;
            curNote = sets[curSetIdx].notes[curNoteIdx];
            curNoteLength = curNote.relativeLength * (timerLength / measureCount);
            console.log("New Note: " + curNote.name + " " + curNote.frequency);
            window.oscillator.frequency.value = curNote.frequency;
        }
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
