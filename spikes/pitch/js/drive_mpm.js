"use strict";

var MPM = require("./../../../src/client/js/MPM.js");

(function () {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var channels = 1;   // microphones are monophonic
    // Create an empty two second stereo buffer
    var frameCount = Math.floor(audioCtx.sampleRate / 100); // 10 millisecond buffer
    var buffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
    console.log("Sample Rate: " + audioCtx.sampleRate);

    // Fill the buffer with white noise which is just random values between -1.0 and 1.0
    // This gives us the actual ArrayBuffer that contains the data
    var nowBuffering = buffer.getChannelData(channels - 1); // channels start with 0 index
    var makeLog = "";
    for (var i = 0; i < frameCount; i++) {
        // Math.random() is in [0; 1.0] audio needs to be in [-1.0; 1.0]
        nowBuffering[i] = Math.random() * 2 - 1;
        makeLog += nowBuffering[i] + ", ";
    }
    console.log("Finished Buffering. \n Buffer length: " + buffer.length + "\n" + makeLog);
    var mpm = new MPM(audioCtx.sampleRate, buffer.length);
    mpm.__testonly__.normalizedSquareDifference(nowBuffering);

})();
