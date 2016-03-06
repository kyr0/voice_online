'use strict';

var $ = require('jquery');
var Lesson = require("../../../src/client/js/Lesson.js");
var LessonTimer = require('./LessonTimer.js');

var lesson = new Lesson([["A2", "1"], ["B2", "1"], ["G2", "1"], ["A2", "1"]]);
var timer = new LessonTimer(lesson);

timer.on("startEvent", function () {
    console.log("External: start");
});

timer.on("noteEvent", function () {
    console.log("External: note");
});

timer.on("endEvent", function () {
    console.log("External: end");
});

timer.startTimer();

//timer.take(5).onValue(function() {
//    var date = new Date().getTime();
//    $("#events").append($("<li>").text(date));
//});