'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Score = require('./Score.js');
var Exercise = require('./Exercise.js');


function Player(aUser, aLesson) {
    EventEmitter.call(this);
    this._exercise = new Exercise(aUser, aLesson);
    this.score = new Score(this._exercise);
    this.sets = this._exercise.sets;
    this.curSetIdx = 0;
    this.setListeners();
}


util.inherits(Player, EventEmitter);


// setListeners is necessary here since it is possible to
//    have different Lessons comprising the set list of an Exercise.
Player.prototype.setListeners = function () {
    var that = this;

    this.on('startNote', function (curNote){
        console.log('startNote: ' + curNote.name);
    });

    this.on('endNote', function (){
        console.log('endNote: ' + that.curNote.name);
        that.score.storeNoteScores();
        that.curNoteIdx++;
        if (that.noteList[that.curNoteIdx]) {
            that.curNote = that.noteList[that.curNoteIdx];
            that.nextEventTime = that.startTime + that.curNote.elapsedTimeAtNotesEnd;
            that.emit('startNote', that.curNote);
        } else {
            that.emit('endSet');
        }
    });

    this.on('startSet', function () {
        console.log('startSet');
        that.curNoteIdx = 0;
        that.noteList = that.sets[that.curSetIdx].noteList;
        that.curNote = that.noteList[that.curNoteIdx];

        that.startTime = Date.now();
        that.nextEventTime = that.startTime + that.curNote.elapsedTimeAtNotesEnd;
        that.emit('startNote', that.curNote);
    });

    this.on('endSet', function (){
        console.log('endSet');
        that.score.storeSetScores();
        that.curSetIdx++;
        if (that.sets[that.curSetIdx]){
            that.emit('startSet', that.sets[that.curSetIdx]);
        } else {
            that.score.evaluateExerciseScores();
            var aggregateNoteScores = that.score.getAggregateNoteScores();
            that.emit('endExercise', aggregateNoteScores);
        }
    });

    this.on('startExercise', function () {
        console.log('startExercise');
    });

    this.on('stopExercise', function () {
        console.log('stopExercise');
    });

    this.on('endExercise', function () {
        console.log('endExercise');
        that.score = new Score(that._exercise);
        that.emit('stopExercise');
    });
};


Player.prototype.checkStatus = function (now){
    if (now >= this.nextEventTime) {
        this.emit('endNote');
    }
};

Player.prototype.start = function (){
    this.curSetIdx = 0;
    this.emit('startExercise');
    this.emit('startSet', this.sets[this.curSetIdx]);
};

Player.prototype.stop = function (){
    this.emit('stopExercise');
};

Player.prototype.pushScore = function (score){
    this.score.pushScore(score);
};

Player.prototype.getCurrentSet= function (){
    return this.sets[this.curSetIdx];
};

module.exports = Player;
