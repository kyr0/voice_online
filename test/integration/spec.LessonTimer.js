"use strict";

var Lesson = require("../../src/client/js/Lesson.js");
var LessonTimer = require('../../src/client/js/LessonTimer.js');

describe('LessonTimer Object', function() {

    beforeEach(function() {
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
        var finish = function(){
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
        var finish = function(){
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
