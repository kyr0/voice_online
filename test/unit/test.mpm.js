///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var MPM = require("../../spikes/pitch/js/MPM.js");
var buffers = require("../resources/audioBuffers.js");

suite('MPM Class', function() {
    var sample48k = 48000;   // a sampleRate of 48000
    var sample44k = 44100;   // sampleRate of 44100
    var buffer2kb = 2048;  // a non-default buffersize of 2kb
    var customCutoff = 0.93; // a non-default cutoff threshold


    suite('MPM default parameters:', function() {
        var mpm;
        setup(function () {
            mpm = new MPM(sample48k);
        });

        test("should have a sampleRate of " + sample48k, function () {
            assert.equal(mpm.__testonly__.sampleRate, sample48k);
        });
        test("should have a bufferSize of DEFAULT_BUFFER_SIZE", function () {
            assert.equal(mpm.__testonly__.DEFAULT_BUFFER_SIZE, mpm.__testonly__.bufferSize);
        });
        test("should have a cutoff of DEFAULT_CUTOFF", function () {
            assert.equal(mpm.__testonly__.DEFAULT_CUTOFF, mpm.__testonly__.cutoff);
        });
    });

    suite('MPM non-default parameters:', function() {
        var mpm;
        setup(function () {
            mpm = new MPM(sample48k, buffer2kb, customCutoff);
        });

        test("should have a bufferSize from construction parameter", function () {
            assert.equal(buffer2kb, mpm.__testonly__.bufferSize);
        });

        test("should have a cutoff from construction parameter", function () {
            assert.equal(customCutoff, mpm.__testonly__.cutoff);
        });

        test("nsdf.length should be same as bufferSize", function () {
            assert.equal(mpm.__testonly__.nsdfLength, mpm.__testonly__.bufferSize);
        });
    });


    suite('normalizedSquareDifference()', function() {
        var time = 1000;  // used as mult/div of sampleRate to determine frame length
        var frameCount = Math.floor(sample44k / time); // 1 millisecond buffer @ 44.1khz sample rate
        var buffer = createMockBuffer(frameCount); // Create a mock buffer
        var mpm;

        setup(function () {
            mpm = new MPM(sample44k, buffer.length);
        });

        test("should populate every nsdf[] element seeded by buffer", function () {
            assert.equal('undefined', checkNSDFValues(mpm)); // should be undefined elements
            mpm.__testonly__.normalizedSquareDifference(buffer);
            assert.equal(true, checkNSDFValues(mpm));  // should be full of -1 to 1
        });

        // TODO: missing test: NaN value into NSDF
    });


    suite('detectPitch()', function() {
        var mpm;

        setup(function () {
            mpm = new MPM(sample44k, buffers.oscBuffer.length);
        });

        test("should populate every nsdf element", function() {
            assert.equal('undefined', checkNSDFValues(mpm)); // should be undefined elements
            mpm.detectPitch(buffers.oscBuffer);
            assert.equal(true, checkNSDFValues(mpm));  // should be full of -1 to 1
        });

        test("should put repeatable values in maxPositions[] given same input", function() {
            var maxValue1 = 0.9998912511141909;
            var maxValue2 = 0.9995046600818478;
            var maxIndex1 = 100;
            var maxIndex2 = 200;
            mpm.detectPitch(buffers.oscBuffer);
            assert.equal(buffers.nsdfArray.toString(), mpm.__testonly__.nsdf.toString());
            assert.equal(maxValue1, mpm.__testonly__.nsdf[maxIndex1]);
            assert.equal(maxValue2, mpm.__testonly__.nsdf[maxIndex2]);
            assert.equal(maxIndex1 + "," + maxIndex2, MPM.__testonly__.maxPositions.toString());
        });

        test("member function prabolicInterpolation() should assign tau/tauValue to turningPointX/Y if 1", function() {
            mpm.__testonly__.nsdf[33] = 1;  // a
            mpm.__testonly__.nsdf[34] = 1;  // b, tau index = 34
            mpm.__testonly__.nsdf[35] = 1;  // c
            mpm.__testonly__.prabolicInterpolation(34);
            assert.equal(34, MPM.__testonly__.turningPointX);
            assert.equal(1, MPM.__testonly__.turningPointY);
        });

        test("prabolicInterpolation() should convert X/Y repeatably given repeated signal", function() {
            mpm.detectPitch(buffers.oscBuffer);  // reset the values in mpm4
            assert.equal(200.46002039225493, MPM.__testonly__.turningPointX);
            assert.equal(1.0000240543039114, MPM.__testonly__.turningPointY);
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


