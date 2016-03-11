'use strict';

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function LessonTimer(lesson) {
    EventEmitter.call(this);

    this.measureCount = lesson.getLengthInMeasures();
    // TODO refactor the following into Lesson, as getLengthInMilliseconds
    // TODO then refactor both into variables, not methods
    var beatCount = this.measureCount * lesson.tempo;
    var minute = 60000;
    this.timerLength = beatCount * (minute / lesson.bpm);

    this.curNoteIdx = 0;
    this.notes = lesson.notes;
    this.curNote = this.notes[this.curNoteIdx];
    // TODO factor this into Note Object
    this.curNoteLengthInMilli = this.curNote.relativeLength * (this.timerLength / this.measureCount);


    this.startTime = null;
}

util.inherits(LessonTimer, EventEmitter);

LessonTimer.prototype.startTimer = function(){
    this.startTime = new Date().getTime();
    this.emit("startEvent");
    this.emit("noteEvent", this.curNote);
    setTimeout(this.timerInstance.bind(this), this.curNoteLengthInMilli);
};

LessonTimer.prototype.timerInstance = function(){
    var expectedNoteEnd = this.curNote.percentOnComplete;
    this.curNoteIdx++;
    this.curNote = this.notes[this.curNoteIdx];
    if (this.curNote) { // solves race condition with endEvent
        this.curNoteLengthInMilli = this.curNote.relativeLength * (this.timerLength / this.measureCount);
        this.emit("noteEvent", this.curNote);
    }
    else {
        this.emit("endEvent");
        return;
    }
    // the diff resets latency which occurs during timer to keep it on track
    var diff = (new Date().getTime() - this.startTime) - (expectedNoteEnd * this.timerLength);
    setTimeout(this.timerInstance.bind(this), this.curNoteLengthInMilli - diff);
};

LessonTimer.prototype.getPctComplete = function(){
    var elapsedTime = (new Date().getTime() - this.startTime);
    return elapsedTime / this.timerLength;
};

module.exports = LessonTimer;
