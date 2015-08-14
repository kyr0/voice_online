"use strict";

(function () {

    var MPM = require("./MPM.js");
    var pEval = require("./PitchManager.js");
    var note = pEval.getNoteByName("C0");
    var startTime = Date.now();
    var elapsedTime = 0;

    var bufferLength = 1024;
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = note.frequency;  // osc start frequency
    var mpm = new MPM(audioCtx.sampleRate, bufferLength);


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


    window.nextTone = function(){
        note = note.nextNote;
        oscillator.frequency.value = note.frequency;
        count = 0;
    };


    var count = 0;
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        if (count === 10) {
            var inputBuffer = audioProcessingEvent.inputBuffer;

            var makeCodeOutput = note.name + "_1024 : ";
            var makeDataLog = "[ ";  // used to peek into the data

            // The input buffer is from the oscillator we connected earlier
            var inputData = inputBuffer.getChannelData(0);

            // Loop through each of the samples in the buffer
            for (var sample = 0; sample < inputBuffer.length; sample++) {
                makeDataLog += inputData[sample] + ", ";
            }
            makeDataLog += " ],";
            var pitchDetected = mpm.getPitch(inputData);
            document.getElementById('list').innerHTML =
                //"Note - " + note.name + " : " + note.frequency +
                //" Pitch detected: " + pitchDetected
                // + "Cents Off: " + pEval.getCentsDiff(pitchDetected, note.name) + "<br>";
                //+ "<br><br>"
                makeCodeOutput + makeDataLog;
            //console.log("Buffer length: " + inputBuffer.length + "\n" +
            //    "Data Values: \n" + makeDataLog);

            if (note.nextNote === null) {
                oscillator.disconnect();
                console.log("WERE DONE");
            }
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