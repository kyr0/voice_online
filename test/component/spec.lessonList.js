// spec.js
"use strict";

var LessonList = require("../../src/browser/js/LessonList.js");

describe('Lesson List', function() {
    beforeEach(function () {
        this.lessonList = new LessonList();
    });

    it('should have a list of lessons', function() {
        expect(this.lessonList.countLessons()).toBe(0);
    });

    it('should be able to add new lessons', function () {

    });
});