"use strict";

(function () {

    var MPM = require("./MPM.js");
    var oct0 = [16.352, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125, 24.500, 25.957, 27.500, 29.135, 30.868];
    var oct1 = [32.703, 34.648, 36.708, 38.891, 41.203, 43.653, 46.249, 48.999, 51.913, 55.000, 58.270, 61.735];
    var oct2 = [65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.83, 110.00, 116.54, 123.47];
    var oct3 = [130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94];
    var oct4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
    var oct5 = [523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77];
    var oct6 = [1046.5, 1108.7, 1174.7, 1244.5, 1318.5, 1396.9, 1480.0, 1568.0, 1661.2, 1760.0, 1864.7, 1975.5];
    var oct7 = [2093.0, 2217.5, 2349.3, 2489.0, 2637.0, 2793.8, 2960.0, 3136.0, 3322.4, 3520.0, 3729.3, 3951.1];
    var oct8 = [4186.0, 4434.9, 4698.6, 4978.0, 5274.0, 5587.7, 5919.9, 6271.9, 6644.9, 7040.0, 7458.6, 7902.1];
    var noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
    var notes2D = [oct0, oct1, oct2, oct3, oct4, oct5, oct6, oct7, oct8]; // 2D array

    var octave = 8;
    var note = 3;  // 11 = B
    var bufferLength = 256;
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = notes2D[octave][note];  // osc start frequency
    var mpm = new MPM(audioCtx.sampleRate, bufferLength);

    // HTML variables
    var listDiv = document.getElementById('list');

    // Create a ScriptProcessorNode with buffer size of bufferLength and a single input and output channel
    var scriptNode = audioCtx.createScriptProcessor(bufferLength, 1, 1);

    oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
    oscillator.start();

    // will loop through all notes and play them into the script node via oscillator
    //for (var octave = 0; octave < notes.length; octave++) {
    //    for (var note = 0; note < notes[octave].length; note++) {
    //        oscillator.frequency.value = notes[octave][note];
    //        oscillator.start();
    //        oscillator.stop(.00581); // stop the oscillator after 256 frames == 44.1k per second * .00581
    //    }
    //}

    var count = 0;
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        //if (octave === notes2D.length) {
        //    oscillator.disconnect();
        //    console.log("WERE DONE");
        //}
        //else if (note === notes2D[0].length) {
        //    octave++;
        //    note = 0;
        //}
        //else { note++; }
        if (count === 0) {
            var inputBuffer = audioProcessingEvent.inputBuffer;
            var makeCodeOutput = "module.exports.noteBuffers = { " + noteNames[note] + octave + " : [ ";
            var makeDataLog = "[ ";  // used to peek into the data

            // The input buffer is from the oscillator we connected earlier
            var inputData = inputBuffer.getChannelData(0);

            //// Loop through each of the samples in the buffer
            //for (var sample = 0; sample < inputBuffer.length; sample++) {
            //    makeDataLog += inputData[sample] + ", ";
            //}
            //makeDataLog += " ]";
            document.getElementById('list').innerHTML = "PITCH: " + mpm.getPitch(inputData);
                //+ "<br><br>" +
                //makeCodeOutput + makeDataLog + " ]};";
            //console.log("Buffer length: " + inputBuffer.length + "\n" +
            //    "Data Values: \n" + makeDataLog);

        }
        count++;
    };

})();

// TODO FIRST: pitch result object
// constructor, REQ takes pitch freq, {time domain data, probability} optional
// // getName() should show note name, octave and cents abov/below


//TEST
// calc pitch of a generated tone of a note, is it > or < than the designated freq?
//   if < then check the freq below and calc cent incremental, is it within .5 cent? if > then do same for above
// next check freq above and calc cent incremental
// iterate through cents: generate tone of cent, check pitch is it within .5 cent?