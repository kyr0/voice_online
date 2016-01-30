///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var BeatTimer = require("../../src/browser/js/BeatTimer.js");
var helpers = require("../resources/testHelpers.js");

for (var key in helpers) {
    global[key] = helpers[key];
}

describe('BeatTimer Object', function() {

    beforeEach(function() {
        this.btTmr = new BeatTimer();
    });

    it("should return accurate percent complete after time", function () {
        var numBeats = 1000; // 1 beat per millisecond
        var bpm = 60000; // 1000 beats a second
        this.btTmr.start(numBeats, bpm);
        sleep(5);
        // 1 ms of latency + 5 milliseconds sleep = ~.006
        expect(this.btTmr.getPercentComplete()).to.be.below(0.01);
    });

});


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}