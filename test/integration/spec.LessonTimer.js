"use strict";

var Lesson = require("../../src/client/js/Lesson.js");
var LessonTimer = require('../../src/client/js/LessonTimer.js');

describe('LessonTimer Object', function() {

    describe(' ', function() {

        beforeEach(function () {
            this.lesson = new Lesson([["A2", "1/1024"], ["B2", "1/512"]]);
            this.timer = new LessonTimer(this.lesson);
            this.startEvents = 0;
            this.noteEvents = 0;
            this.fragEvents = 0;
            var that = this;

            this.timer.on("startEvent", function () {
                that.startEvents++;
            });

            this.timer.on("noteEvent", function () {
                that.noteEvents++;
            });

            this.timer.on("fragmentEvent", function () {
                that.fragEvents++;
            });
        });

        it("should have the right number of start and note events", function (done) {
            var that = this;
            var finish = function () {
                expect(that.startEvents).to.equal(1);
                expect(that.noteEvents).to.equal(2);
                done();
            };
            this.timer.on("endEvent", function () {
                finish();
            });
            this.timer.startTimer();
        });

        it("should have the right number of fragments proportional to note length", function (done) {
            var that = this;
            var fragCount = [];
            var finish = function () {
                expect(fragCount[1]).to.equal(fragCount[0] * 2);
                done();
            };
            this.timer.on("noteEvent", function () {
                fragCount.push(that.fragEvents);
            });
            this.timer.on("endEvent", function () {
                finish();
            });
            this.timer.startTimer();
        });
    });

    describe('noteEvent', function() {
        beforeEach(function () {

        });

        it("should be with 2% of 50% complete for 2nd note and have correct names", function (done) {
            // bundling the assertions since test takes a long time to run
            var lesson = new Lesson([["A2", "1/256"], ["B2", "1/256"], ["B2", "1/256"]]);
            var timer = new LessonTimer(lesson);
            var noteInfo = [];
            var finish = function () {
                expect(noteInfo[0].curNote.name).to.equal('A2');
                expect(noteInfo[1].curNote.name).to.equal('B2' );
                expect(noteInfo[0].curPct * 100).to.equal(0);
                expect(noteInfo[1].curPct * 100).to.be.closeTo(50, 2);
                done();
            };
            timer.on("noteEvent", function (args) {
                noteInfo.push(args);
            });
            timer.on("endEvent", function () {
                finish();
            });
            timer.startTimer();
        });

        it("should have pctComplete as multiple of 10", function (done) {
            // bundling the assertions since test takes a long time to run
            var lesson = new Lesson([["A2", "1/256"],["A2", "1/256"],["A2", "1/256"],
                ["A2", "1/256"],["A2", "1/256"],["A2", "1/256"],["A2", "1/256"],["A2", "1/256"],
                ["A2", "1/256"],["A2", "1/256"]]);
            var timer = new LessonTimer(lesson);
            var noteInfo = [];
            var finish = function () {
                expect(noteInfo[0].curPct * 100).to.equal(0);
                expect(noteInfo[1].curPct * 100).to.be.closeTo(10, 3);
                expect(noteInfo[2].curPct * 100).to.be.closeTo(20, 3);
                expect(noteInfo[3].curPct * 100).to.be.closeTo(30, 4);
                expect(noteInfo[4].curPct * 100).to.be.closeTo(40, 4);
                expect(noteInfo[5].curPct * 100).to.be.closeTo(50, 4);
                expect(noteInfo[6].curPct * 100).to.be.closeTo(60, 4);
                expect(noteInfo[7].curPct * 100).to.be.closeTo(70, 5);
                expect(noteInfo[8].curPct * 100).to.be.closeTo(80, 4);
                expect(noteInfo[9].curPct * 100).to.be.closeTo(90, 2);
                done();
            };
            timer.on("noteEvent", function (args) {
                noteInfo.push(args);
            });
            timer.on("endEvent", function () {
                finish();
            });
            timer.startTimer();
        });

    });
});
