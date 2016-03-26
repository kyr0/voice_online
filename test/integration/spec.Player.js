"use strict";

var Lesson = require("../../src/client/js/Lesson.js");
var User = require('../../src/client/js/User.js');
var Player = require('../../src/client/js/Player.js');

describe('Player Object', function() {

    beforeEach(function() {
        this.lesson = new Lesson({ noteList: [["A2", "1/2048"], ["A2", "1/2048"]] });
        this.user = new User("A2", "Eb3");
        this.player = new Player(this.user, this.lesson);

        this.endSetEvents = 0;
        this.startSetEvents = 0;
        this.startExerciseEvents = 0;
        this.noteEvents = 0;
        var that = this;

        this.player.on("startExercise", function () {
            that.startExerciseEvents++;
        });

        this.player.on("startSet", function () {
            that.startSetEvents++;
        });

        this.player.on("startNote", function () {
            that.noteEvents++;
        });

        this.player.on("endSet", function () {
            that.endSetEvents++;
        });
    });

    it("should have fired the right events by the time endExercise is fired", function (done) {
        var that = this;
        var finish = function(){
            expect(that.startExerciseEvents).to.equal(1);
            expect(that.startSetEvents).to.equal(7);
            expect(that.endSetEvents).to.equal(7);
            expect(that.noteEvents).to.equal(14);
            expect(that.player.isPlaying).to.equal(false);
            done();
        };
        this.player.on("endExercise", function() {
            finish();
        });
        this.player.start();
    });

    it("should correctly set index and isPlaying when it's stopped", function (done) {
        var that = this;
        this.player.isPlaying = true;
        this.player.curSetIdx = 3;
        this.player.on("stopExercise", function() {
            expect(that.player.isPlaying).to.equal(false);
            expect(that.player.curSetIdx).to.equal(0);
            done();
        });
        this.player.stop();
    });

    it("should set isPlaying to true on startExercise", function (done) {
        var that = this;
        var finish = function(){
            expect(that.player.isPlaying).to.equal(true);
            done();
        };
        this.player.on("startExercise", function () {
            finish();
        });
        this.player.start();
    });

    it("should fire a stopExercise event if restarting during play", function (done) {
        this.player.on("stopExercise", function() {
            done();  // will timeout if unsuccessful
        });
        this.player.start();
        this.player.start();
    });

});
