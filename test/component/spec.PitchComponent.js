/**
 * Created by jaboing on 2015-08-17.
 */
///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var MPM = require("../../spikes/pitch/js/MPM.js");
var buffer = require("../resources/audioBuffers.js");
var pEval = require("../../spikes/pitch/js/PitchManager.js");

/*
 * A suite of longer running tests to test all apect of the pitch component.
 *
 * The pitch component consists of the MPM & PitchDetectionResult classes as well as the
 *   PitchManager library.
 */

describe('Pitch Component: ', function() {
    var sample44k = 44100;   // sampleRate of 44100

    describe('detectPitch()', function() {
        var mpm;

        beforeEach(function () {
            mpm = new MPM(sample44k, buffer.oscBuffer.length);
        });

        it("should assign frequency 110 to buffer w/pitch A2 given 512 samples", function() {
            expect(Math.round(mpm.detectPitch(buffer.noteBuffers.A2_512))).toEqual(110);
        });

        it("should detect all pitches within range (A1 - Bb7) at a .5 cent accuracy", function() {
            //this.timeout(0); // this test cannot timeout (it takes ~2 seconds)  // do we need this?
            var note = pEval.getNoteByName("A1");
            var noteFreq = note.frequency;
            var tone;
            var pitchDetected;
            while (note.name !== "Ab7"){
                tone = buffer.noteBuffers[note.name + "_1024"];
                pitchDetected = mpm.detectPitch(tone);
                expect(pEval.getCentsDiff(pitchDetected, noteFreq)).toBe(0);
                note = note.nextNote;
                noteFreq = note.frequency;
            }
        });

        it("should assign pitch == -1, & isPitched() == false to results from tones below A1", function() {
            var result = mpm.detectPitch(buffer.noteBuffers.Ab1_1024);
            expect(result.isPitched()).toEqual(false);
            expect(result.getPitchFrequency()).toEqual(-1);
        });


    });

    // this could be used to add noise to a signal for clarity testing in future
    function createMockBuffer(numFrames){
        var mockBuffer = new Array(numFrames);
        // Fill the mock buffer with white noise which is just random values between -1.0 and 1.0
        // This gives us the actual ArrayBuffer that contains the data
        for (var i = 0; i < numFrames; i++) {
            // Math.random() is in [0; 1.0] audio needs to be in [-1.0; 1.0]
            mockBuffer[i] = Math.random() * 2 - 1;
        }
        return mockBuffer;
    }

});


