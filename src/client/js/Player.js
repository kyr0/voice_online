"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;

var Exercise = require("./Exercise.js").Exercise;
var LessonTimer = require("./LessonTimer.js");


function Player(aUser, aLesson) {
    EventEmitter.call(this);

    var that = this;
    this.curSetIdx = 0;
    this.isPlaying = false;

    this.sets = new Exercise(aUser, aLesson).sets;
    this.timer = null;
    this.resetListeners(this.sets[this.curSetIdx]);
}


util.inherits(Player, EventEmitter);


Player.prototype.resetListeners = function(curSet){
    var that = this;
    this.timer = new LessonTimer(curSet);

    this.timer.on("startSet", function(){
        if (!(that.isPlaying)){
            that.isPlaying = true;
            that.emit("startExercise");
            that.emit("startSet");
        }
        else {
            that.emit("startSet");
        }
    });

    this.timer.on("note", function(curNote){
        that.emit("note", curNote);
    });

    this.timer.on("endSet", function(){
        that.curSetIdx++;
        if (that.sets[that.curSetIdx]){
            that.resetListeners(that.sets[that.curSetIdx]);
            that.emit("endSet");
            that.timer.startTimer();
        }
        else {
            that.emit("endSet");
            that.isPlaying = false;
            that.emit("endExercise");
        }
    });
};

Player.prototype.start = function(){
    this.timer.startTimer();
};

module.exports = Player;
