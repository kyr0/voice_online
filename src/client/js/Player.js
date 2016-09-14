'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Score = require('./Score.js');
var Exercise = require('./Exercise.js');
var LessonTimer = require('./LessonTimer.js');


function Player(aUser, aLesson) {
    EventEmitter.call(this);
    this._exercise = new Exercise(aUser, aLesson);
    this.score = new Score(this._exercise);
    this.sets = this._exercise.sets;
    this.timer = null;
    this.resetExercise();
}


util.inherits(Player, EventEmitter);


Player.prototype.resetExercise = function() {
    this.score = new Score(this._exercise);
    this.curSetIdx = 0;
    this.resetListeners(this.sets[this.curSetIdx]);
};

// resetListeners is necessary here since it is possible to
//    have different Lessons comprising the set list of an Exercise.
Player.prototype.resetListeners = function (curSet){
    var that = this;
    this.timer = new LessonTimer(curSet);

    this.timer.on('startSet', function (){
        that.emit('startSet', that.sets[that.curSetIdx]);
    });

    this.timer.on('startNote', function (curNote){
        that.emit('startNote', curNote);
    });

    this.timer.on('endNote', function (curNote){
        that.score.storeNoteScores();
        that.emit('endNote', curNote);
    });

    // not to be confused with 'stop'
    this.timer.on('endSet', function (){
        that.score.storeSetScores();

        that.curSetIdx++;
        if (that.sets[that.curSetIdx]){
            that.resetListeners(that.sets[that.curSetIdx]);
            that.emit('endSet');
            that.timer.startTimer();
        }
        else {
            that.score.evaluateExerciseScores();
            var aggregateNoteScores = that.score.getAggregateNoteScores();
            that.resetExercise();
            that.emit('endExercise', aggregateNoteScores);
        }
    });
};

Player.prototype.start = function (){
    this.emit('startExercise');
    this.timer.startTimer();
};

Player.prototype.stop = function (){
    this.timer.stopTimer();
    this.resetExercise();
    this.emit('stopExercise');
};

Player.prototype.pushScore = function (score){
    this.score.pushScore(score);
};

Player.prototype.getPctComplete = function (){
    return this.timer.getPctComplete();
};

Player.prototype.getCurrentSet= function (){
    return this.sets[this.curSetIdx];
};

// I think that chart is a dict of note names and their relation
//    to the lowest note, but not 100% sure, needs refactor anyway.
Player.prototype.getCurrentChart = function (){
    return this.sets[this.curSetIdx].chart;
};

module.exports = Player;
