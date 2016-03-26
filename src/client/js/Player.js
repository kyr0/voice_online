'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Exercise = require('./Exercise.js');
var LessonTimer = require('./LessonTimer.js');


function Player(aUser, aLesson) {
    EventEmitter.call(this);

    this.sets = new Exercise(aUser, aLesson).sets;
    this.timer = null;
    this.resetExercise();
}


util.inherits(Player, EventEmitter);


Player.prototype.resetExercise = function() {
    if (this.timer){
        this.timer.stopTimer();
    }
    this.isPlaying = false;
    this.curSetIdx = 0;
    this.resetListeners(this.sets[this.curSetIdx]);
};

// resetListeners is necessary here since it is possible to
//    have different Lessons comprising the set list of an Exercise.
Player.prototype.resetListeners = function(curSet){
    var that = this;
    this.timer = new LessonTimer(curSet);

    this.timer.on('startSet', function(){
        that.emit('startSet');
    });

    this.timer.on('startNote', function(curNote){
        that.emit('startNote', curNote);
    });

    this.timer.on('endNote', function(curNote){
        that.emit('endNote', curNote);
    });

    // not to be confused with 'stop'
    this.timer.on('endSet', function(){
        that.curSetIdx++;
        if (that.sets[that.curSetIdx]){
            that.resetListeners(that.sets[that.curSetIdx]);
            that.emit('endSet');
            that.timer.startTimer();
        }
        else {
            that.emit('endSet');
            that.resetExercise();
            that.emit('endExercise');
        }
    });
};

Player.prototype.start = function(){
    if (this.isPlaying){
        this.stop();
    }
    this.isPlaying = true;
    this.emit('startExercise');
    this.timer.startTimer();
};

Player.prototype.stop = function(){
    this.resetExercise();
    this.emit('stopExercise');
};

Player.prototype.getPctComplete = function(){
    return this.timer.getPctComplete();
};

Player.prototype.getCurrentSet= function(){
    return this.sets[this.curSetIdx];
};

// I think that chart is a dict of note names and their relation
//    to the lowest note, but not 100% sure, needs refactor anyway.
Player.prototype.getCurrentChart = function(){
    return this.sets[this.curSetIdx].chart;
};

module.exports = Player;
