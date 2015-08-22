///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var PitchDetectionResult = require("../../spikes/pitch/js/PitchDetectionResult.js");

var helpers = require("../resources/testHelpers.js");
for (var key in helpers) {
    global[key] = helpers[key];
}


describe('PitchDetectionResult Object', function() {

    beforeEach( function() {
        this.pdr = new PitchDetectionResult();
    });

    it("should have a default pitch of -1", function() {
        expect(this.pdr.getPitchFrequency()).toEqual(-1);
    });

    it("should have a default probability of -1", function() {
        expect(this.pdr.getProbability()).toEqual(-1);
    });

    it("should have a default isPitched() of false", function() {
        expect(this.pdr.isPitched()).toEqual(false);
    });

    it("setPitch() should throw an error if attempt to set invalid pitch (string)", function() {
        var errMsg = "setPitch(): not a valid pitch setting, was: Hey";
        expect(catchError("setPitch","Hey", this.pdr)).toEqual(errMsg);
    });

    it("setPitch() should throw an error if attempt to set invalid pitch (neg #)", function() {
        var errMsg = "setPitch(): not a valid pitch setting, was: -0.5";
        expect(catchError("setPitch", -0.5, this.pdr)).toEqual(errMsg);
    });

    it("should evaluate to -1 number by default when no pitch is set", function() {
        expect(this.pdr.valueOf()).toEqual(-1);
    });

    describe('', function() {
        var testPitch = 21345;
        beforeEach( function() {
            this.pdr.setPitch(testPitch);
        });

        it("should evaluate to the pitch frequency number by default", function() {
            expect(this.pdr.valueOf()).toEqual(testPitch);
        });

        it("getPitchFrequency() should return the number set by setPitchFrequency()", function () {
            expect(this.pdr.getPitchFrequency()).toEqual(testPitch);
        });
    });

    it("setProbability() should throw an error if attempt to set invalid probability (string)", function() {
        var errMsg = "setProbability(): not a valid setting, was: Hey";
        expect(catchError("setProbability", "Hey", this.pdr)).toEqual(errMsg);
    });

    it("getProbability() should return the number set by setProbability()", function() {
        var testProb = -21345;
        this.pdr.setProbability(testProb);
        expect(this.pdr.getProbability()).toEqual(testProb);
    });

    it("setIsPitched() should throw an error if attempt to set non-boolean", function() {
        var errMsg = "setIsPitched(): not a valid setting, was: Hey";
        expect(catchError("setIsPitched", "Hey", this.pdr)).toEqual(errMsg);
    });

    it("isPitched() should return the value from setIsPitched()", function() {
        this.pdr.setIsPitched(true);
        expect(this.pdr.isPitched()).toEqual(true);
        this.pdr.setIsPitched(false);
        expect(this.pdr.isPitched()).toEqual(false);
    });
});


