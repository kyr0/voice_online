/**
 * Created by jaboing on 2015-08-17.
 */
///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var MPM = require("../../src/client/js/MPM.js");
var buffer = require("../resources/audioBuffers.js");
var nMgr = require("../../src/client/js/NoteManager.js");

var helpers = require("../resources/testHelpers.js");

for (var key in helpers) {
    global[key] = helpers[key];
}

/*
 * A suite of longer running tests to test all apect of the pitch component.
 *
 * The pitch component consists of the MPM & PitchDetectionResult classes as well as the
 *   PitchManager library.
 */
describe('Pitch component', function() {

    describe('detectPitch()', function() {

        beforeEach(function () {
            var sample44k = 44100;   // sampleRate of 44100
            this.mpm = new MPM(sample44k);
        });

        it("should accurately detect all pitches within range (A1 - G7 inclusive) at a .5 cent accuracy", function() {
            this.timeout(0);
            assertValidPitchDetectionOnRangeOfNotes("A1", "Ab7", this.mpm);
        });

        it("should not attempt to determine pitch *below* A1", function() {
            this.timeout(0);
            assertInvalidPitchDetectionOnRangeOfNotes("C0", "A1", this.mpm);
        });

        it("should not attempt to determine pitch *above* G7", function() {
            this.timeout(0);
            assertInvalidPitchDetectionOnRangeOfNotes("Ab7", "B8", this.mpm);
        });

    });
});

function assertValidPitchDetectionOnRangeOfNotes(startNote, endNote, mpm) {
    var note = nMgr.getNoteMapAtName(startNote);
    var noteFreq = note.frequency;
    var tone;
    var pitchDetected;
    while (note.name !== endNote){
        tone = buffer.noteBuffers[note.name + "_1024"];
        pitchDetected = mpm.detectPitch(tone);
        expect(nMgr.getCentsDiff(pitchDetected, noteFreq)).to.equal(0);
        note = note.nextNote;
        noteFreq = note.frequency;
    }
}

function assertInvalidPitchDetectionOnRangeOfNotes(startNote, endNote, mpm) {
    var note = nMgr.getNoteMapAtName(startNote);
    var tone;
    var result;
    while (note.name !== endNote){
        tone = buffer.noteBuffers[note.name + "_1024"];
        result = mpm.detectPitch(tone);
        expect(result.isPitched()).to.equal(false);
        expect(result.getPitchFrequency()).to.equal(-1);
        note = note.nextNote;
    }
}