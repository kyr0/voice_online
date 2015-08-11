"use strict";

(function () {

    var oct0 = [16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87];
    var oct1 = [32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49, 51.91, 55, 58.27, 61.74];
    var oct2 = [65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98, 103.8, 110, 116.5, 123.5];
    var oct3 = [130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185.0, 196, 207.7, 220, 233.1, 246.9];
    var oct4 = [261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370, 392, 415.3, 440, 466.2, 493.9];
    var oct5 = [523.3, 554.4, 587.3, 622.3, 659.3, 698.5, 740, 784, 830.6, 880, 932.3, 987.8];
    var oct6 = [1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976];
    var oct7 = [2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951];
    var oct8 = [4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902];

    var notes = [oct0, oct1, oct2, oct3, oct4, oct5, oct6, oct7, oct8]; // 2D array
    
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
