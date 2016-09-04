'use strict';

var Audio = require('../../src/client/js/Audio.js');
var Lesson = require('../../src/client/js/Lesson.js');
var User = require('../../src/client/js/User.js');
var Player = require('../../src/client/js/Player.js');


describe('Audio', function() {

    beforeEach(function() {
        var lesson = new Lesson({ noteList: [['B3', '1/2'], ['A3', '1/2']]});
        var user = new User('C4', 'C5');
        window.lPlayer = new Player(user, lesson);
    });


    it('should fire onaudioprocess event with user media stream', function (done) {
        // if this doesn't timeout, it's a pass
        var audio = new Audio();
        audio.handleBuffer = function() {
            done();
        };
        audio.getUserInput();
        audio.startSet(window.lPlayer.getCurrentSet());
    });

    // describe('_processPitchResult', function() {
    //
    //     it('should ', function (done) {
    //     });
    //
    // });




});
