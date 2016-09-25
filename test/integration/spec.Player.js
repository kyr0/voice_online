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
        this.endExerciseEvents = 0;
        this.stopExerciseEvents = 0;

        this.player.on('startExercise', function () {
            this.startExerciseEvents++;
        }.bind(this));

        this.player.on('endExercise', function () {
            this.endExerciseEvents++;
        }.bind(this));

        this.player.on('stopExercise', function () {
            this.stopExerciseEvents++;
        }.bind(this));

        this.player.on('startSet', function () {
            this.startSetEvents++;
        }.bind(this));

        this.player.on('startNote', function () {
            this.startNoteEvents++;
        }.bind(this));

        this.player.on('endNote', function () {
            this.endNoteEvents++;
        }.bind(this));

        this.player.on('endSet', function () {
            this.endSetEvents++;
        }.bind(this));
    });

    it('should have fired the right events by the time endExercise is fired', function () {
        this.player.start();
        var doCheckStatus = function (){
            this.player.checkStatus(this.player.nextEventTime);
        }.bind(this);
        _.times(10, doCheckStatus);
        expect(this.startExerciseEvents).to.equal(1);
        expect(this.startSetEvents).to.equal(5);
        expect(this.endSetEvents).to.equal(5);
        expect(this.startNoteEvents).to.equal(10);
        expect(this.endNoteEvents).to.equal(10);
        expect(this.endExerciseEvents).to.equal(1);
        expect(this.stopExerciseEvents).to.equal(1);
    });

    it('should pass the current Set when startSet is fired', function () {
        this.player.on('startSet', function (curSet) {
            expect(curSet.chart).to.exist;
        });
        this.player.start();
    });

    it('should set index to zero when started', function () {
        this.player.curSetIdx = 3;
        this.player.start();
        expect(this.player.curSetIdx).to.equal(0);
    });


    it('should fire stopEexercise when the stop method is called', function() {
        this.player.stop();
        expect(this.stopExerciseEvents).to.equal(1);
    });
});
