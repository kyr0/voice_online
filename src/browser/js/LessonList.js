"use strict";

//var Lesson = require("./Lesson.js");

function LessonList () {
    var lessons = [];

    this.countLessons = function() {
        return lessons.length;
    };

}


module.exports = LessonList;