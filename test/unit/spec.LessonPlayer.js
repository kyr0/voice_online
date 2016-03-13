"use strict";

var LessonPlayer = require("../../src/client/js/LessonPlayer.js");
var User = require("../../src/client/js/User.js");
var Lesson = require("../../src/client/js/Lesson.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('LessonPlayer constructor', function() {

    it("should throw error if user range is smaller than lesson range", function () {
        var aUser = new User("A2", "E3");
        var aLesson = new Lesson([["A2", "1"], ["F3", "1"]]);
        var fn = function() {new LessonPlayer(aUser, aLesson)};
        expect(fn).to.throw(Error, /User range must be same size or smaller than lesson range/);
    });
});

describe('LessonsPlayer', function() {

    it("should increase percent of completion after start when time passes", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2", "1"], ["F3", "1"]]);
        var lPlayer = new LessonPlayer(aUser, aLesson);
        lPlayer.start();
        sleep(1);
        var pct = lPlayer.getCurSetPctComplete();
        expect(pct).to.be.above(0);
        sleep(1);
        expect(lPlayer.getCurSetPctComplete()).to.be.above(pct);
    });

    it("should start with a new Lesson object at the bottom of user's range", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2", "1"], ["F3", "1"]]);
        var lPlayer = new LessonPlayer(aUser, aLesson);
        expect(lPlayer.getCurrentSet().lowestNote.name).to.equal("A2");
    });

    it("should start with a new Lesson object at the bottom of user's range", function () {
        var aUser = new User("B1", "B3");
        var aLesson = new Lesson([["C2", "1"], ["C3", "1"]]);
        var lPlayer = new LessonPlayer(aUser, aLesson);
        lPlayer._setCurSetIndex(12);
        expect(lPlayer.getCurrentSet().lowestNote.name).to.equal("B2");
    });

    it("should transpose all notes in Lesson correctly (first set)", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2","1/8"],["A1","1/2"],["Db3","1/4"],["B2","1/32"]]);
        var lPlayer = new LessonPlayer(aUser, aLesson);
        var expectedList = [
            {name: "B3", noteLength: "1/8"},
            {name: "A2", noteLength: "1/2"},
            {name: "Db4", noteLength: "1/4"},
            {name: "B3", noteLength: "1/32"}
        ];
        compareNoteLists(lPlayer.getCurrentSet().notes, expectedList);
    });

    it("should transpose all notes in Lesson correctly (final set)", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2","1/8"],["A1","1/2"],["Db3","1/4"],["B2","1/32"]]);
        var lPlayer = new LessonPlayer(aUser, aLesson);
        lPlayer._setCurSetIndex(8);
        var expectedList = [
            {name: "G4", noteLength: "1/8"},
            {name: "F3", noteLength: "1/2"},
            {name: "A4", noteLength: "1/4"},
            {name: "G4", noteLength: "1/32"}
        ];
        compareNoteLists(lPlayer.getCurrentSet().notes, expectedList);
    });

    describe('', function() {

        beforeEach(function () {
            var aUser = new User("A2", "Ab4");
            var aLesson = new Lesson([["B2", "1"]]);
            this.lPlayer = new LessonPlayer(aUser, aLesson);
        });

        it("should have the right number of sets based on Lesson / User ranges (out of bounds)", function () {
            this.lPlayer._setCurSetIndex(24);
            expect(this.lPlayer.getCurrentSet()).to.be.undefined;
        });

        it("should have the right number of sets based on Lesson / User ranges (final set)", function () {
            this.lPlayer._setCurSetIndex(23);
            expect(this.lPlayer.getCurrentSet()).to.exist;
        });

        it("should show isPlaying = false on init", function () {
            expect(this.lPlayer.isPlaying()).to.be.false;
        });

        it("should show isPlaying = true after start", function () {
            this.lPlayer.start();
            expect(this.lPlayer.isPlaying()).to.be.true;
        });

        // TODO move into integration
        //it("should show isPlaying = false after final set", function () {
        //    this.lPlayer._setCurSetIndex(24);
        //    this.lPlayer.start();
        //    expect(this.lPlayer.isPlaying()).to.be.true;
        //});
    });
});


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}


function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).to.equal(expectedList[i].name);
        expect(noteList[i].noteLength).to.equal(expectedList[i].noteLength);
    }
}