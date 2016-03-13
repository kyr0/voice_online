"use strict";
var Lesson = require("./Lesson.js");

// TODO move audioContext setup / teardown into LessonPlayer Begin / End
// TODO make sure that curSet, curNote, curMap, etc are always at top level for speed
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
    var measureCount = aLesson.lengthInMeasures;
    var numBeats = measureCount * aLesson.tempo;
    var baseDistance = aLesson.lowestNote.getDistanceToNote(aUser.bottomNote.name);

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
            //console.log("Milliseconds passed: " + (new Date().getTime() - startTime));
            curSetIdx++;
            if (curSetIdx < sets.length) {
                curNoteIdx = 0;
                curNote = sets[curSetIdx].notes[curNoteIdx];
                curNoteLength = curNote.relativeLength * (timerLength / measureCount);
                //console.log("New Note: " + curNote.name + " " + curNote.frequency);
                // TODO find a better way to use this as a test harness, custom event emission?
                window.oscillator.frequency.value = curNote.frequency;
                elapsedFragments = 0;
                lastNoteElapsedFragments = 0;
                _beginTimer(numBeats, bpm);
            }
            else {
                isPlaying = false;
                curSetIdx = 0;
                curNoteIdx = 0;
                elapsedFragments = 0;
                lastNoteElapsedFragments = 0;
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
            //console.log("New Note: " + curNote.name + " " + curNote.frequency);
            window.oscillator.frequency.value = curNote.frequency;
        }
    }

    function _generateSets(){
        var sets = [];
        sets.push(baseSet);
        var setCount = baseSet.highestNote.getDistanceToNote(aUser.topNote.name) + 1;
        for (var set = 1; set < setCount; set++){
            sets.push(_transposeLesson(set, baseSet));
        }
        for (set = 0; set < sets.length; set++){
            var ntList = sets[set].notes;
            sets[set].chart = {};
            for (var nt = 0; nt < ntList.length; nt++){
                sets[set].chart[ntList[nt].name] = ntList[nt].relativeInterval;
            }
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
        curSetIdx = 0;
        curNoteIdx = 0;
        elapsedFragments = 0;
        lastNoteElapsedFragments = 0;
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

    this.getCurrentChart = function(){
        return sets[curSetIdx].chart;
    };

    this.isPlaying = function(){
        return isPlaying;
    };

    baseSet = _transposeLesson(baseDistance, aLesson);
    var sets = _generateSets();
}

module.exports = LessonPlayer;
