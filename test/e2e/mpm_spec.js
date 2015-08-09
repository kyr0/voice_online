//// spec.js
//"use strict";
//
//var MPM = require("../../spikes/pitch/mpm.js");
//require("protractor");
//
//beforeEach(function() {
//    isAngularSite(false);
//});
////
//describe('MPM Class', function() {
//
//    it('should populate every nsdf element using the buffer', function(){
//        browser.get("http://localhost:9000/index.html");
//        var AudioContext = new (browser.window.AudioContext || browser.window.webkitAudioContext)();
//        var audioCtx = new AudioContext();
//        var channels = 1;   // microphones are monophonic
//        // Create an empty two second stereo buffer
//        var frameCount = audioCtx.sampleRate * 2.0; // 2 second buffer
//        var buffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
//        console.log("Sample Rate: " + audioCtx.sampleRate);
//
//        // Fill the buffer with white noise which is just random values between -1.0 and 1.0
//        // This gives us the actual ArrayBuffer that contains the data
//        var nowBuffering = buffer.getChannelData(channels - 1); // channels start with 0 index
//        for (var i = 0; i < frameCount; i++) {
//            // Math.random() is in [0; 1.0] audio needs to be in [-1.0; 1.0]
//            nowBuffering[i] = Math.random() * 2 - 1;
//        }
//        var mpm3 = new MPM(audioCtx.sampleRate, buffer.length);
//        mpm3.__testonly__.normalizedSquareDifference(nowBuffering);
//
//    });
//
//});