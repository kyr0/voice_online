'use strict';

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function LessonTimer(lesson) {
    EventEmitter.call(this);

    this.lengthInMilliseconds = lesson.lengthInMilliseconds;
    this.curNoteIdx = 0;
    this.notes = lesson.notes;
    this.curNote = this.notes[this.curNoteIdx];
    this.startTime = null;
}

util.inherits(LessonTimer, EventEmitter);

LessonTimer.prototype.startTimer = function(){
    this.startTime = new Date().getTime();
    this.emit("startSet");
    this.emit("note", this.curNote);
    setTimeout(this.timerInstance.bind(this), this.curNote.lengthInMilliseconds);
};

LessonTimer.prototype.timerInstance = function(){
    var expectedNoteEnd = this.curNote.percentOnComplete;
    this.curNoteIdx++;
    this.curNote = this.notes[this.curNoteIdx];
    if (this.curNote) { // solves race condition with endEvent
        this.emit("note", this.curNote);
    }
    else {
        this.emit("endSet");
        return;
    }
    // the diff resets latency which occurs during timer to keep it on track
    var diff = (new Date().getTime() - this.startTime) - (expectedNoteEnd * this.lengthInMilliseconds);
    setTimeout(this.timerInstance.bind(this), this.curNote.lengthInMilliseconds - diff);
};

LessonTimer.prototype.getPctComplete = function(){
    var elapsedTime = (new Date().getTime() - this.startTime);
    return elapsedTime / this.lengthInMilliseconds;
};

module.exports = LessonTimer;
