"use strict";

(function () {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Sample Rate: " + audioCtx.sampleRate);
    var oscillator = audioCtx.createOscillator();
    //oscillator.frequency.value = 1976;

    // Create a ScriptProcessorNode with a bufferSize of 256 and a single input and output channel
    // This will fire the
    var scriptNode = audioCtx.createScriptProcessor(256, 1, 1);

    oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
    oscillator.start();
    oscillator.stop(.00581); // stop the oscillator after 256 frames == 44.1k per second * .00581
    // the effect of this is the the script processing node should fire audioProcessingEvent only once



    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        oscillator.disconnect(); // disconnect here so we get only a few frames
        // The input buffer is from the oscillator we connected earlier
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var makeDataLog = "";  // used to peek into the data
        //var makeBufferLog = "";  // used to peek into the buffer


        var inputData = inputBuffer.getChannelData(0);


        // Loop through the 256 samples
        for (var sample = 0; sample < inputBuffer.length; sample++) {
            makeDataLog += inputData[sample] + ", ";
            //makeBufferLog += inputBuffer[sample].toString() + " :: ";

            // make output equal to the same as the input
            //outputData[sample] = inputData[sample];
            // add noise to each output sample
            //outputData[sample] += ((Math.random() * 2) - 1) * 0.2;
        }

        console.log("Buffer length: " + inputBuffer.length + "\n" +
            "Data Values: \n" + makeDataLog);
        // + "\nBuffer Values: \n" + makeBufferLog

    };


    ////var channels = 1;   // microphones are monophonic
    ////// Create an empty two second stereo buffer
    ////var frameCount = Math.floor(audioCtx.sampleRate / 100); // 10 millisecond buffer
    ////var buffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
    //
    //
    //
    //// Fill the buffer with white noise which is just random values between -1.0 and 1.0
    //// This gives us the actual ArrayBuffer that contains the data
    //var nowBuffering = buffer.getChannelData(channels - 1); // channels start with 0 index
    //
    //for (var i = 0; i < frameCount; i++) {
    //    // Math.random() is in [0; 1.0] audio needs to be in [-1.0; 1.0]
    //    nowBuffering[i] = Math.random() * 2 - 1;
    //
    //}
    //console.log("Finished Buffering. \n Buffer length: " + buffer.length + "\n" + makeLog);
    ////var mpm = new MPM(audioCtx.sampleRate, buffer.length);
    ////mpm.__testonly__.normalizedSquareDifference(nowBuffering);

})();
