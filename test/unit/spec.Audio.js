'use strict';

var Audio = require('../../src/client/js/Audio.js');
var Lesson = require('../../src/client/js/Lesson.js');
var User = require('../../src/client/js/User.js');
var Player = require('../../src/client/js/Player.js');


describe('Audio', function () {

    beforeEach(function () {
        var lesson = new Lesson({ noteList: [['B3', '1/2'], ['A3', '1/2']] });
        var user = new User('C4', 'C5');
        this.player = new Player(user, lesson);
        this.audio = new Audio();

    });


    it('should fire onaudioprocess event with user media stream', function (done) {
        // if this doesn't timeout, it's a pass
        this.audio._handleBuffer = function () {
            done();  // head it off at the pass
        };
        this.audio.getUserInput();
        this.audio.startSet(this.player.getCurrentSet());
    });

    it('should clear all audio buffers when an Exercise is stopped', function () {
        this.audio.stopNote = function () {};  // stub out stopNote()
        this.audio.pianoBufferList = 'dummy';  // dummy setting for pianoBufferList
        this.audio.currentNote = { name: 'not -' };
        this.audio.stopAudio();                // action under test
        expect(this.audio.pianoBufferList).to.deep.equal([]);
    });

});
