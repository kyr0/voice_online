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

    it("should return 50 percent", function () {
        var numBeats = 10; // 1 beat per millisecond
        var bpm = 60000; // 1000 beats a second
        this.btTmr.start(numBeats, bpm);
        sleep(5); // should be 50%
        // 1 ms of latency + 5 seconds sleep = 60% or .6
        expect(this.btTmr.getPercentComplete()).to.be.within(.5,.7);
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