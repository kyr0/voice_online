/*
 The MIT License (MIT)

 Copyright (c) 2014 Chris Wilson

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var MPM = require("../../../src/browser/js/MPM.js");
var pEval = require("../../../src/browser/js/NoteManager.js");

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

window.onload = function() {
    window.pitchFreq = -1;
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


    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        console.log("OnAudioProcess");
        var inputBuffer = audioProcessingEvent.inputBuffer;
        // The input buffer is from the oscillator we connected earlier
        var inputData = inputBuffer.getChannelData(0);
        //console.log(inputData);
        updatePitch(inputData);
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
        var noteObj =  pEval.getClosestNoteFromPitch(pitchFreq);
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