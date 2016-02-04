"use strict";

var LessonPlayer = require("../../src/browser/js/LessonPlayer.js");
var User = require("../../src/browser/js/User.js");
var Lesson = require("../../src/browser/js/Lesson.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('LessonPlayer', function() {

    it("should throw error if user range is smaller than lesson range", function () {
        var aUser = new User("A2", "B2");
        var aLesson = new Lesson([["A2", "1"], ["C3", "1"]]);
        var fn = function() {new LessonPlayer(aLesson, aUser)};
        expect(fn).to.throw(Error, /must be at least 6 semitones/);
    });

});
