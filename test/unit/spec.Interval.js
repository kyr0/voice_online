///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var Interval = require("../../src/browser/js/Interval.js");
var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}

describe('Interval Object', function() {

    beforeEach(function() {
        this.note1 = "A1";
        this.note2 = "B2";
        this.itvl = new Interval(this.note1, this.note2);
        this.itvl2 = new Interval(this.note2, this.note1);
        this.itvl3 = new Interval(this.note2, this.note2);
    });

    it("should have the right name", function () {
        expect(this.itvl.name).to.equal("A1:B2");
        expect(this.itvl2.name).to.equal("B2:A1");
        expect(this.itvl3.name).to.equal("B2:B2");
    });

    it("should create an Interval with correct distance (up)", function () {
        expect(this.itvl.halfsteps).to.equal(14);
    });

    it("should create an Interval with correct distance (down)", function () {
        expect(this.itvl2.halfsteps).to.equal(-14);
    });

    it("should create an Interval with correct distance (unison)", function () {
        expect(this.itvl3.halfsteps).to.equal(0);
    });

    it("should create an Interval with correct direction (up)", function () {
        expect(this.itvl.direction).to.equal("up");
    });

    it("should create an Interval with correct direction (down)", function () {
        expect(this.itvl2.direction).to.equal("down");
    });

    it("should create an Interval with correct direction (unison)", function () {
        expect(this.itvl3.direction).to.equal("none");
    });

    it('should throw a not found error if endNoteMap not found', function () {
        var startNote = this.itvl2.startNote;
        var endNote = this.itvl2.endNote;
        // we have to create a method that can be passed into catchError without wiping the data
        //  objects in arrays such as [startNoteMap, endNoteMap] come through as 'undefined
        var method = this.itvl2.__testonly__.getIntervalDistance;
        var parameter = function() { method(startNote, endNote, "up") };
        var errMsg = "getIntervalDistance() did not encounter the end point of the interval. End Point: " +
            endNote.name;
        expect(catchError(parameter, null)).to.equal(errMsg);
    });



});
