// spec.js
"use strict";

var LessonList = require("../../src/browser/js/LessonList.js");
var helpers = require("../resources/testHelpers.js");

for (var key in helpers) {
    global[key] = helpers[key];
}

describe('Lesson List', function() {
    beforeEach(function () {
        this.lessonList = new LessonList();
    });

    it('should have a list of lessons', function() {
        expect(this.lessonList.countLessons()).to.equal(0);
    });

    it('should be able to add new lessons', function () {

    });
});