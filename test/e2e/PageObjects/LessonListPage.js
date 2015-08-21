/**
 * Created by jaboing on 2015-08-03.
 */
"use strict";

// TODO: setup configs so that we don't need to hard code the base URL in page objects

require("protractor");

var LessonListPage = function () {

    this.visitPage = function () {
        browser.get("http://localhost:9000/lessonList.html");
    };

    this.getTitle = function () {
        return browser.getTitle();
    };

    this.getNumLessons = function() {
        return 0;
    };
};

module.exports = LessonListPage;