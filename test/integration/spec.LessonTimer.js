"use strict";

var Lesson = require("../../src/client/js/Lesson.js");
var LessonTimer = require('../../src/client/js/LessonTimer.js');

describe('LessonTimer Object', function() {

    describe(' ', function() {

        beforeEach(function () {
            this.lesson = new Lesson({ noteList: [["A2", "1/1024"], ["B2", "1/512"]] });
            this.timer = new LessonTimer(this.lesson);
            this.startEvents = 0;
            this.noteEvents = 0;
            var that = this;

            this.timer.on("startSet", function () {
                that.startEvents++;
            });

            this.timer.on("note", function () {
                that.noteEvents++;
            });

        });

        it("should have the right number of start and note events", function (done) {
            var that = this;
            var finish = function () {
                expect(that.startEvents).to.equal(1);
                expect(that.noteEvents).to.equal(2);
                done();
            };
            this.timer.on("endSet", function () {
                finish();
            });
            this.timer.startTimer();
        });

    });

    describe('stop event', function() {

        it("should fire properly when the stop method is called", function(done) {
            var lesson = new Lesson({ noteList: [["A2", "1/32"]] });
            var timer = new LessonTimer(lesson);
            timer.on("stop", function () {
                done();  // this test will timeout if stop is not firing
            });
            timer.startTimer();
            timer.stopTimer();
        });

    });

    describe('getPctComplete function', function() {

        beforeEach(function () {
            this.lesson = new Lesson({ noteList: [["A2", "1/32"]] });
            this.timer = new LessonTimer(this.lesson);
        });

        it("should return zero if not playing (not yet started)", function() {
            this.timer.getPctComplete();
        });

        it("should return zero if not playing (stopped after play)", function() {
            this.timer.getPctComplete();
            this.timer.startTimer();
            this.timer.stopTimer();
        });

    });

    describe('note event', function() {

        it("should should fire at correct time when note of different lengths present", function (done) {
            var lesson = new Lesson({ noteList: [["A2", "1/32"], ["B2", "1/16"], ["B2", "1/32"], ["B2", "1/8"]] });
            var timer = new LessonTimer(lesson);
            var noteInfo = [];
            var finish = function () {
                expect(noteInfo[3] * 100).to.be.closeTo(50, 2);
                done();
            };
            timer.on("note", function () {
                var curPct = timer.getPctComplete();
                noteInfo.push(curPct);
            });
            timer.on("endSet", function () {
                finish();
            });
            timer.startTimer();
        });

        it("should have correct pctComplete when many notes present", function (done) {
            // bundling the assertions since test takes a long time to run
            var noteArr = [];
            for (var nt = 0; nt < 100; nt++){
                noteArr.push(["A2", "1/256"]);
            }
            var lesson = new Lesson({ noteList: noteArr });
            var timer = new LessonTimer(lesson);
            var noteInfo = [];
            var finish = function () {
                for (var i = 0; i < noteInfo.length; i++){
                    expect(noteInfo[i] * 100).to.be.closeTo(i, 1);
                }
                done();
            };
            timer.on("note", function () {
                var curPct = timer.getPctComplete();
                noteInfo.push(curPct);
            });
            timer.on("endSet", function () {
                finish();
            });
            timer.startTimer();
        });

    });
});
