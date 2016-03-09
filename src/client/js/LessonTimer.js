'use strict';

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function LessonTimer(lesson) {
    EventEmitter.call(this);

    var measureCount = lesson.getLessonLength();
    var beatCount = measureCount * lesson.tempo;
    var minute = 60000;
    this.timerLength = beatCount * (minute / lesson.bpm);
    var beatLength = this.timerLength / beatCount;
    this.fragmentLength = beatLength / (lesson.smallestNoteSize / lesson.tempo);
    var curNoteIdx = 0;
    this.curNote = lesson.notes[curNoteIdx];
    var curNoteLength = this.curNote.relativeLength * (this.timerLength / measureCount);


    this.startTime = null;
    this.elapsedFragments = 0;
    var lastNoteElapsedFragments = 0;

    this.on("fragmentEvent", function(){
        var elapsedInCurrentNote = (this.elapsedFragments - lastNoteElapsedFragments) * this.fragmentLength;
        if (curNoteLength <= elapsedInCurrentNote) {
            lastNoteElapsedFragments = this.elapsedFragments;
            curNoteIdx++;
            this.curNote = lesson.notes[curNoteIdx];
            if (this.curNote) { // solves race condition with endEvent
                this.emitNoteEvent();
                curNoteLength = this.curNote.relativeLength * (this.timerLength / measureCount);
            }
        }
    });
}

util.inherits(LessonTimer, EventEmitter);

LessonTimer.prototype.emitNoteEvent = function(){
    var curPct = this.getPctComplete();
    var args = {
        curPct: curPct,
        curNote: this.curNote
    };
    this.emit("noteEvent", args);
};

LessonTimer.prototype.startTimer = function(){
    this.startTime = new Date().getTime();
    this.emit("startEvent");
    this.emitNoteEvent();
    setTimeout(this.timerInstance.bind(this), this.fragmentLength);
};

LessonTimer.prototype.timerInstance = function(){
    this.elapsedFragments++;
    var curPct = this.getPctComplete();
    if (curPct >= 1) {
        this.emit("endEvent");
    }
    else {
        this.emit("fragmentEvent");
        // the diff resets latency which occurs during timer to keep it on track
        var diff = (new Date().getTime() - this.startTime) - (this.elapsedFragments * this.fragmentLength);
        if (diff > 0){  // just in case we get a negative value (which happens a lot)
            setTimeout(this.timerInstance.bind(this), this.fragmentLength - diff);
        }
        else {
            setTimeout(this.timerInstance.bind(this), this.fragmentLength);
        }
    }
};

LessonTimer.prototype.getPctComplete = function(){
    var elapsedTime = (new Date().getTime() - this.startTime);
    return elapsedTime / this.timerLength;
};

module.exports = LessonTimer;
