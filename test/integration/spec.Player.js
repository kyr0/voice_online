'use strict';

var Score= require('../../src/client/js/Score.js');
var Lesson = require('../../src/client/js/Lesson.js');
var User = require('../../src/client/js/User.js');
var Player = require('../../src/client/js/Player.js');
var _ = require('lodash');

describe('Player Object', function() {

    beforeEach(function() {
        this.lesson = new Lesson({ noteList: [['A2', '1/2048'], ['B2', '1/2048']] });
        this.user = new User('A2', 'Eb3');
        this.player = new Player(this.user, this.lesson);

        this.endSetEvents = 0;
        this.startSetEvents = 0;
        this.startExerciseEvents = 0;
        this.startNoteEvents = 0;
        this.endNoteEvents = 0;
        var that = this;

        this.player.on('startExercise', function () {
            that.startExerciseEvents++;
        });

        this.player.on('startSet', function () {
            that.startSetEvents++;
        });

        this.player.on('startNote', function () {
            that.startNoteEvents++;
        });

        this.player.on('endNote', function () {
            that.endNoteEvents++;
        });

        this.player.on('endSet', function () {
            that.endSetEvents++;
        });
    });

    it('should have fired the right events by the time endExercise is fired', function (done) {
        var that = this;
        var finish = function(){
            expect(that.startExerciseEvents).to.equal(1);
            expect(that.startSetEvents).to.equal(5);
            expect(that.endSetEvents).to.equal(5);
            expect(that.startNoteEvents).to.equal(10);
            expect(that.endNoteEvents).to.equal(10);
            expect(that.player.isPlaying).to.equal(false);
            done();
        };
        this.player.on('endExercise', function() {
            finish();
        });
        this.player.start();
    });

    it('should correctly set index and isPlaying when stopped', function (done) {
        var that = this;
        this.player.isPlaying = true;
        this.player.curSetIdx = 3;
        this.player.on('stopExercise', function() {
            expect(that.player.isPlaying).to.equal(false);
            expect(that.player.curSetIdx).to.equal(0);
            done();
        });
        this.player.stop();
    });

    it('should set isPlaying to true on startExercise', function (done) {
        var that = this;
        var finish = function(){
            expect(that.player.isPlaying).to.equal(true);
            done();
        };
        this.player.on('startExercise', function () {
            finish();
        });
        this.player.start();
    });

    it('should fire a stopExercise event if restarting during play', function (done) {
        this.player.on('stopExercise', function() {
            done();  // will timeout if unsuccessful
        });
        this.player.start();
        this.player.start();
    });

    it('should reset scores on resetExercise()', function () {
        this.player.score = "dummy";
        this.player.resetExercise();
        expect(this.player.score).to.be.an.instanceof(Score);
    });

});
