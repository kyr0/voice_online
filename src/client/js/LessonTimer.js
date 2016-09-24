'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function LessonTimer(lesson) {
    EventEmitter.call(this);

    this.durationInMilliseconds = lesson.durationInMilliseconds;
    this.curNoteIdx = 0;
    this.noteList = lesson.noteList;
    this.curNote = this.noteList[this.curNoteIdx];
    this.startTime = null;
    this.curID = null;
}

util.inherits(LessonTimer, EventEmitter);

LessonTimer.prototype.startTimer = function (){
    this.startTime = Date.now();
    this.emit('startSet');
    this.emit('startNote', this.curNote);
    this.curID = setTimeout(this.timerInstance.bind(this), this.curNote.durationInMilliseconds);
};

LessonTimer.prototype.stopTimer = function(){
    clearTimeout(this.curID);
    this.startTime = null;
    this.emit('stop');
};

LessonTimer.prototype.timerInstance = function () {
    this.emit('endNote', this.curNote);
    var expectedNoteEnd = this.curNote.percentOnComplete;
    this.curNoteIdx++;
    this.curNote = this.noteList[this.curNoteIdx];
    if (this.curNote) { // solves race condition with endEvent
        this.emit('startNote', this.curNote);
        // the diff resets latency which occurs during timer to keep it on track
        var diff = (Date.now() - this.startTime) - (expectedNoteEnd * this.durationInMilliseconds);
        this.curID = setTimeout(this.timerInstance.bind(this), this.curNote.durationInMilliseconds - diff);
    }
    else {
        this.emit('endSet');
    }
};

LessonTimer.prototype.getPctComplete = function () {
    if (this.startTime){
        var elapsedTime = (Date.now() - this.startTime);
        return elapsedTime / this.durationInMilliseconds;
    }
    else {
        return 0;
    }
};

module.exports = LessonTimer;
