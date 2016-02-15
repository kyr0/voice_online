var MPM = require("../../../src/client/js/MPM.js");
var NoteMaps = require("../../../src/client/js/NoteMaps.js");
var Lesson = require("../../../src/client/js/Lesson.js");
var User = require("../../../src/client/js/User.js");
var LessonPlayer = require("../../../src/client/js/LessonPlayer.js");

// these window assignments must be done outside of onLoad
// for sharing with paper.js in case they are accessed before load
window.percentComplete = 0;
window.pitchFreq = -1;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var bufferLength = 1024;
var scriptNode = null;
window.oscillator = null;
var mediaStreamSource = null;
var mpm = null;
var ntMaps = new NoteMaps();
var lastResult = null;
var detectorElem,
    pitchElem,
    noteElem,
    detuneElem,
    detuneAmount;

var lessons = [];
lessons.push(new Lesson([["A2", "1"], ["B2", "1"], ["G2", "7/8"], ["A2", "2/4"]]));

var users = [];
users.push(new User("A1", "F3"));  // anything lower than A1 will == -1 pitch

window.lPlayer = new LessonPlayer(users[0], lessons[0]);


window.onload = function() {
    console.log("Window OnLoad");
    audioContext = new AudioContext();
    window.oscillator = audioContext.createOscillator();
    window.oscillator.frequency.value = lPlayer.getCurrentSet().notes[0].frequency;  // osc start frequency
    mpm = new MPM(audioContext.sampleRate, bufferLength);
    scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);

    // UI Elements
    detectorElem = document.getElementById( "detector" );
    pitchElem = document.getElementById( "pitch" );
    noteElem = document.getElementById( "note" );
    detuneElem = document.getElementById( "detune" );
    detuneAmount = document.getElementById( "detune_amt" );


    // use the oscillator
    window.oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
    window.oscillator.start();

    // get the mic
    //getUserMedia(
    //    {
    //        "audio": {
    //            "mandatory": {
    //                "googEchoCancellation": "false",
    //                "googAutoGainControl": "false",
    //                "googNoiseSuppression": "false",
    //                "googHighpassFilter": "false"
    //            },
    //            "optional": []
    //        }
    //    }, gotStream
    //);

    lPlayer.start();

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
        lastResult = -1;
    }
    else {
        var noteObj =  ntMaps.getClosestNoteFromPitch(pitchFreq);
        var detune = noteObj.getCentsDiff(pitchFreq);
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