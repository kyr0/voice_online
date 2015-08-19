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

suite('Pitch Component: ', function() {
    var sample44k = 44100;   // sampleRate of 44100

    suite('detectPitch()', function() {
        var mpm;

        setup(function () {
            mpm = new MPM(sample44k, buffer.oscBuffer.length);
        });

        test("detectPitch() should assign frequency 110 to buffer w/pitch A2 given 512 samples", function() {
            assert.equal(110, Math.round(mpm.detectPitch(buffer.noteBuffers.A2_512)));
        });

        test("MPM should detect all pitches within range (A1 - Bb7) at a .5 cent accuracy", function() {
            this.timeout(0); // this test cannot timeout (it takes ~2 seconds)
            var note = pEval.getNoteByName("A1");
            var noteFreq = note.frequency;
            var tone;
            var pitchDetected;
            while (note.name !== "Ab7"){
                tone = buffer.noteBuffers[note.name + "_1024"];
                pitchDetected = mpm.detectPitch(tone);
                assert.equal(0, pEval.getCentsDiff(pitchDetected, noteFreq));
                note = note.nextNote;
                noteFreq = note.frequency;
            }
        });

        test("detectPitch() should assign -1 to sounds below A1", function() {
            assert.equal(-1, mpm.detectPitch(buffer.noteBuffers.Ab1_1024));
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


