// spec.js
"use strict";

var LessonListPage = require("./pageObjects/LessonListPage");

describe('Lesson List Page', function() {
    beforeEach(function() {
        isAngularSite(false);
    });

    var lessonListPage = new LessonListPage();

    it('should have a title', function() {
        lessonListPage.visitPage();
        expect(lessonListPage.getTitle()).toEqual('Lesson List');
    });

});