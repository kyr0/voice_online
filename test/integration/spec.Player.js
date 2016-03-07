"use strict";

var Lesson = require("../../src/client/js/Lesson.js");
var User = require('../../src/client/js/User.js');
var Player = require('../../src/client/js/Player.js');

describe('Player Object', function() {

    beforeEach(function() {
        this.lesson = new Lesson([["A2", "1/2048"], ["B2", "1/2048"]]);
        this.user = new User("A2", "A4");
        this.player = new Player(this.user, this.lesson);

        this.endEvents = 0;
        var that = this;

        this.player.timer.on("endEvent", function () {
            that.endEvents++;
        });

    });

    it("should increment curSetIdx and set isPlaying to false on endEvent", function (done) {
        var that = this;
        var finish = function(){
            expect(that.player.curSetIdx).to.equal(1);
            expect(that.player.isPlaying).to.equal(false);
            done();
        };
        this.player.timer.on("endEvent", function () {
            finish();
        });
        this.player.start();
    });

    it("should set isPlaying to true on startEvent", function (done) {
        var that = this;
        var finish = function(){
            expect(that.player.isPlaying).to.equal(true);
            done();
        };
        this.player.timer.on("startEvent", function () {
            finish();
        });
        this.player.start();
    });

});
