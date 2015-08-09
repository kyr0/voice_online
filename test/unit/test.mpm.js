///**
// * Created by jaboing on 2015-07-31.
// */
"use strict";

var assert = require("assert");
var MPM = require("../../spikes/pitch/js/mpm.js");

suite('MPM Class', function() {
    setup(function() {
        //...
    });
    suite('test_MPM', function() {
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
        test("should have a nsdf length same as bufferSize", function() {
            assert.equal(mpm2.__testonly__.nsdfLength, mpm2.__testonly__.bufferSize);
        });
        //test("should populate every nsdf element using the buffer", function() {
        //    //var AudioContext = new (window.AudioContext || window.webkitAudioContext)();
            //var audioCtx = new AudioContext();
            //var channels = 1;   // microphones are monophonic
            //// Create an empty two second stereo buffer
            //var frameCount = audioCtx.sampleRate * 2.0; // 2 second buffer
            //var buffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
            //console.log("Sample Rate: " + audioCtx.sampleRate);
            //
            //// Fill the buffer with white noise which is just random values between -1.0 and 1.0
            //// This gives us the actual ArrayBuffer that contains the data
            //var nowBuffering = buffer.getChannelData(channels - 1); // channels start with 0 index
            //for (var i = 0; i < frameCount; i++) {
            //    // Math.random() is in [0; 1.0] audio needs to be in [-1.0; 1.0]
            //    nowBuffering[i] = Math.random() * 2 - 1;
            //}
            //var mpm3 = new MPM(audioCtx.sampleRate, buffer.length);
            //mpm3.__testonly__.normalizedSquareDifference(nowBuffering);
        //});
    });
});