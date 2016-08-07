"use strict";

var Audio = require('../../src/client/js/Audio.js');
var Lesson = require('../../src/client/js/Lesson.js');
var User = require('../../src/client/js/User.js');
var Player = require('../../src/client/js/Player.js');


describe('', function() {

    beforeEach(function() {
        // Karma creates this global __html__ property that will hold all
        // of our HTML so we can populate the body during our tests
        window.close();
        if (window.__html__) {
            document.body.innerHTML = window.__html__['test/integration/fixtures/dummy.html'];
        }
        var lesson = new Lesson({ noteList: [['B3', '1/2'], ['A3', '1/2']]});
        var user = new User('C4', 'C5');
        window.lPlayer = new Player(user, lesson);
    });

    it("should be able to access innerHTML", function () {
        expect(document.body.innerHTML).to.exist;
    });

    it("calls the original function", function () {
        function once(fn) {
            var returnValue, called = false;
            return function () {
                if (!called) {
                    called = true;
                    returnValue = fn.apply(this, arguments);
                }
                return returnValue;
            };
        }

        var callback = sinon.spy();
        var proxy = once(callback);

        proxy();

        expect(callback.called).to.be.true;
    });

    it("should fire onaudioprocess event", function (done) {
        // if this doesn't timeout, it's a pass
        var audio = new Audio();
        audio.updatePitch = function() {
            done();
        };
        audio.getSingleNoteTestInput();
        audio.startSet(window.lPlayer.getCurrentSet());
    });


});
