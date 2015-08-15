///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var MPM = require("../../spikes/pitch/js/MPM.js");
var config = require("./test.MPM.config.js");
var pEval = require("../../spikes/pitch/js/PitchManager.js");


suite('MPM Class', function() {
    setup(function() {
        //...
    });
    suite('test_MPM:', function() {

        var mpm = new MPM(48000);
        test("should have a sampleRate of 48000", function() {
            assert.equal(mpm.__testonly__.sampleRate, 48000);
        });
        test("should have a bufferSize of DEFAULT_BUFFER_SIZE", function() {
            assert.equal(mpm.__testonly__.DEFAULT_BUFFER_SIZE, mpm.__testonly__.bufferSize);
        });
        test("should have a cutoff of DEFAULT_CUTOFF", function() {
            assert.equal(mpm.__testonly__.DEFAULT_CUTOFF, mpm.__testonly__.cutoff);
        });

        var mpm2 = new MPM(48000, 2048, 0.93);
        test("should have a bufferSize from construction parameter", function() {
            assert.equal(2048, mpm2.__testonly__.bufferSize);
        });

        test("should have a cutoff from construction parameter", function() {
            assert.equal(0.93, mpm2.__testonly__.cutoff);
        });

        test("nsdf.length should be same as bufferSize", function() {
            assert.equal(mpm2.__testonly__.nsdfLength, mpm2.__testonly__.bufferSize);
        });



        var sampleRate = 44100;
        var time = 1000;  // used as mult/div of sampleRate to determine frame length
        var frameCount = Math.floor(sampleRate / time); // 1 millisecond buffer @ 44.1khz sample rate
        var buffer = createMockBuffer(frameCount); // Create a mock buffer

        test("normalizedSquareDifference() should populate every nsdf[] element seeded by buffer", function() {
            var mpm3 = new MPM(sampleRate, buffer.length);
            assert.equal('undefined', checkNSDFValues(mpm3)); // should be undefined elements
            mpm3.__testonly__.normalizedSquareDifference(buffer);
            assert.equal(true, checkNSDFValues(mpm3));  // should be full of -1 to 1
        });


        var mpm4 = new MPM(sampleRate, config.oscBuffer.length);

        test("getPitch() should populate every nsdf element", function() {
            assert.equal('undefined', checkNSDFValues(mpm4)); // should be undefined elements
            mpm4.getPitch(config.oscBuffer);
            assert.equal(true, checkNSDFValues(mpm4));  // should be full of -1 to 1
        });

        test("maxPositions[] should have repeatable values given same input", function() {
            assert.equal(config.nsdfArray.toString(), mpm4.__testonly__.nsdf.toString());
            var max1 = 0.9998912511141909;
            var max2 = 0.9995046600818478;
            assert.equal(max1, mpm4.__testonly__.nsdf[100]);
            assert.equal(max2, mpm4.__testonly__.nsdf[200]);
            assert.equal("100,200", MPM.__testonly__.maxPositions.toString());
        });

        test("prabolicInterpolation() should conditionally assign tau/tauValue to turningPointX/Y", function() {
            mpm4.__testonly__.nsdf[33] = 1;  // a
            mpm4.__testonly__.nsdf[34] = 1;  // b, tau index = 34
            mpm4.__testonly__.nsdf[35] = 1;  // c
            mpm4.__testonly__.prabolicInterpolation(34);
            assert.equal(34, MPM.__testonly__.turningPointX);
            assert.equal(1, MPM.__testonly__.turningPointY);
        });

        test("prabolicInterpolation() should convert X/Y repeatably given repeated signal", function() {
            mpm4.getPitch(config.oscBuffer);  // reset the values in mpm4
            assert.equal(200.46002039225493, MPM.__testonly__.turningPointX);
            assert.equal(1.0000240543039114, MPM.__testonly__.turningPointY);
        });

        test("getPitch() should assign frequency 110 to buffer w/pitch A2 given 512 samples", function() {
            assert.equal(110, Math.round(mpm4.getPitch(config.noteBuffers.A2_512)));
        });

        test("MPM should detect all pitches within range (A1 - Bb7) at a .5 cent accuracy", function() {
            this.timeout(0); // this test cannot timeout (it takes ~2 seconds)
            var note = pEval.getNoteByName("A1");
            var noteFreq = note.frequency;
            var tone;
            var pitchDetected;
            while (note.name !== "Ab7"){
                tone = config.noteBuffers[note.name + "_1024"];
                pitchDetected = mpm4.getPitch(tone);
                assert.equal(0, pEval.getCentsDiff(pitchDetected, noteFreq));
                note = note.nextNote;
                noteFreq = note.frequency;
            }
        });

        test("getPitch() should assign -1 to sounds below A1", function() {
            assert.equal(-1, mpm4.getPitch(config.noteBuffers.A0_1024));
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

    function checkNSDFValues(mpmObj){
        for (var i = 0; i < mpmObj.__testonly__.nsdfLength; i++) {
            if (typeof mpmObj.__testonly__.nsdf[i] === 'undefined') { return 'undefined' }
            else if (mpmObj.__testonly__.nsdf[i] > 1 || mpmObj.__testonly__.nsdf[i] < -1) {
                return false;
            }
        }
        return true;
    }
});


