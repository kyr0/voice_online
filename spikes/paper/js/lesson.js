var MPM = require("../../../src/browser/js/MPM.js");
var pEval = require("../../../src/browser/js/NoteManager.js");
var BeatTimer = require("../../../src/browser/js/BeatTimer.js");
var Lesson = require("../../../src/browser/js/Lesson.js");

window.percentComplete = 0;  // these must be here for sharing with paper.js
window.pitchFreq = -1;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var bufferLength = 1024;
var scriptNode = null;
var mediaStreamSource = null;
var mpm = null;
var lastResult = null;
var detectorElem,
    pitchElem,
    noteElem,
    detuneElem,
    detuneAmount;
var lesson = new Lesson([["A2", "1/4"], ["B2", "1/4"], ["C2", "1/4"], ["D2", "1/4"]]);

window.onload = function() {
    console.log("Window OnLoad");
    audioContext = new AudioContext();
    mpm = new MPM(audioContext.sampleRate, bufferLength);
    scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);

    // UI Elements
    detectorElem = document.getElementById( "detector" );
    pitchElem = document.getElementById( "pitch" );
    noteElem = document.getElementById( "note" );
    detuneElem = document.getElementById( "detune" );
    detuneAmount = document.getElementById( "detune_amt" );


    // get the mic
    getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            }
        }, gotStream
    );

    beatTimer = new BeatTimer();
    beatTimer.start(40, 120);

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        console.log("OnAudioProcess");
        var inputBuffer = audioProcessingEvent.inputBuffer;
        // The input buffer is from the oscillator we connected earlier
        var inputData = inputBuffer.getChannelData(0);
        //console.log(inputData);
        updatePitch(inputData);
        window.percentComplete = beatTimer.getPercentComplete();
    };
    //console.log(scriptNode
    //    + "target: " + scriptNode.target
    //    + "\ntype: " + scriptNode.type
    //    + "\nbubbles?: " + scriptNode.bubbles
    //    + "\ncancelable?:" + scriptNode.cancelable
    //    + "\nplaybackTime: " + scriptNode.playbackTime);
};

function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect stream to the destination.
    mediaStreamSource.connect( scriptNode );

}



function updatePitch(buf) {
    var resultObj = mpm.detectPitch(buf);
    var pitchFreq = resultObj.getPitchFrequency();
    var probability = resultObj.getProbability();
    if (pitchFreq == -1 || probability < .95) {
        pitchFreq = -1;
        if (lastResult !== -1) {
            detectorElem.className = "vague";
            pitchElem.innerHTML = "--";
            noteElem.innerHTML = "-";
            detuneElem.className = "";
            detuneAmount.innerHTML = "--";
            lastResult = -1;
        }
    } else {
        //console.log("Pitch: " + pitchFreq + " Probability: " + probability);
        detectorElem.className = "confident";
        var noteObj =  pEval.getClosestNoteNameFromPitch(pitchFreq);
        pitchElem.innerHTML = Math.round(pitchFreq);
        noteElem.innerHTML = noteObj.name;
        var detune = pEval.getCentsDiff(pitchFreq, noteObj.frequency);
        if (detune == 0 ) {
            detuneElem.className = "";
            detuneAmount.innerHTML = "Perfect.";
        } else {
            if (detune < 0)
                detuneElem.className = "flat";
            else
                detuneElem.className = "sharp";
            detuneAmount.innerHTML = Math.abs( detune );
        }
        lastResult = 1;
    }
    window.pitchFreq = pitchFreq;
}