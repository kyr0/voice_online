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
        var numBeats = 2;
        var bpm = 240;
        this.btTmr.start(numBeats, bpm);
        sleep(250);
        expect(this.btTmr.getPercentComplete()).toBe(1);
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