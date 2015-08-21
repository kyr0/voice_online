// spec.js
"use strict";

var LessonListComponent = require("../../src/browser/js/LessonList.js");

describe('Lesson List', function() {
    beforeEach(function() {
        isAngularSite(false);
    });

    var lessonList = new LessonListComponent();

    it('should have a list of lessons', function() {
        expect(lessonList.countLessons()).toBeGreaterThan(0);
    });

});