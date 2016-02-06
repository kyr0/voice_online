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
        var aUser = new User("A2", "E3");
        var aLesson = new Lesson([["A2", "1"], ["F3", "1"]]);
        var fn = function() {new LessonPlayer(aUser, aLesson)};
        expect(fn).to.throw(Error, /User range must be same size or smaller than lesson range/);
    });

    it("should start with a new Lesson object at the bottom of user's range", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2", "1"], ["F3", "1"]]);
        var lPlayer = new LessonPlayer(aUser, aLesson);
        expect(lPlayer.currentSet.getLowestNote().name).to.equal("A2");
    });

    it("should transpose all notes in Lesson correctly", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2","1/8"],["A1","1/2"],["Db3","1/4"],["B2","1/32"]]);
        var lPlayer = new LessonPlayer(aUser, aLesson);
        var expectedList = [
            {name: "B3", noteLength: "1/8"},
            {name: "A2", noteLength: "1/2"},
            {name: "Db4", noteLength: "1/4"},
            {name: "B3", noteLength: "1/32"}
        ];
        compareNoteLists(lPlayer.currentSet.notes, expectedList);
    });
});


function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).to.equal(expectedList[i].name);
        expect(noteList[i].noteLength).to.equal(expectedList[i].noteLength);
    }
}