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
    this.timer = new LessonTimer(aLesson);
    this.currentSet = this.sets[this.curSetIdx];

    this.timer.on("startEvent", function(){
        that.isPlaying = true;
    });

    this.timer.on("noteEvent", function(){
    //
    });

    this.timer.on("endEvent", function(){
        that.curSetIdx++;
        that.isPlaying = false;
    });

}

util.inherits(Player, EventEmitter);

Player.prototype.start = function(){
    this.timer.startTimer();
};

module.exports = Player;
