'use strict';

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function LessonTimer(lessonObj) {
    var lesson = lessonObj ;
    EventEmitter.call(this);

    var measureCount = lesson.lengthInMeasures;
    var beatCount = measureCount * lesson.tempo;
    var minute = 60000;
    this.timerLength = beatCount * (minute / lesson.bpm);
    var beatLength = this.timerLength / beatCount;
    this.fragmentLength = beatLength / (lesson.smallestNoteSize / lesson.tempo);
    var curNoteIdx = 0;
    var curNote = lesson.notes[curNoteIdx];
    var curNoteLength = curNote.relativeLength * (this.timerLength / measureCount);


    this.startTime = null;
    this.elapsedFragments = 0;
    var lastNoteElapsedFragments = 0;

    this.on("startEvent", function () {
    //
    });

    this.on("fragmentEvent", function(){
        if (curNote) {
            var elapsedInCurrentNote = (this.elapsedFragments - lastNoteElapsedFragments) * this.fragmentLength;
            if (curNoteLength <= elapsedInCurrentNote) {
                this.emit("noteEvent");
                lastNoteElapsedFragments = this.elapsedFragments;
                curNoteIdx++;
                curNote = lesson.notes[curNoteIdx];
                curNoteLength = curNote.relativeLength * (this.timerLength / measureCount);
            }
        }
    });

    this.on("noteEvent", function () {
    //
    });

    this.on("endEvent", function () {
    //
    });
}

util.inherits(LessonTimer, EventEmitter);

LessonTimer.prototype.startTimer = function(){
    this.emit("startEvent");
    this.emit("noteEvent");
    this.startTime = new Date().getTime();
    setTimeout(this.timerInstance.bind(this), this.fragmentLength);
};

LessonTimer.prototype.timerInstance = function(){
    this.elapsedFragments++;
    if (this.getCurSetPctComplete() >= 1) {
        this.emit("endEvent");
    }
    else {
        this.emit("fragmentEvent");
        // the diff resets latency which occurs during timer to keep it on track
        var diff = (new Date().getTime() - this.startTime) - (this.elapsedFragments * this.fragmentLength);
        setTimeout(this.timerInstance.bind(this), this.fragmentLength - diff);
    }
};

LessonTimer.prototype.getCurSetPctComplete = function(){
    // the result of this function has 1 ms of latency
    var elapsedTime = (new Date().getTime() - this.startTime);
    return elapsedTime / this.timerLength;
};

module.exports = LessonTimer;
