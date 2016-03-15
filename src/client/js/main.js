"use strict";

var MPM = require("./MPM.js");
var NoteMaps = require("./NoteMaps.js");
var Lesson = require("./Lesson.js");
var User = require("./User.js");
var Player = require("./Player.js");

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

var lessons = [];
lessons.push(new Lesson([["A2", "1/32"], ["B2", "1/32"], ["G2", "1/32"], ["A2", "1/32"]]));
lessons.push(new Lesson([["A2", "2"], ["B2", "1/2"], ["G2", "3/8"], ["A2", "2/4"],["Ab2", "1/4"]]));
lessons.push(new Lesson([["A2", "1"], ["B2", "3"], ["G2", "1/4"]]));

var users = [];
users.push(new User("A1", "E2"));  // anything lower than A1 will == -1 pitch

window.lPlayer = null;

function resetPlayerListeners(){
    window.lPlayer.on("note", function(curNote){
        window.oscillator.frequency.value = curNote.frequency;  // osc start frequency
    });

    window.lPlayer.on("stopExercise", function(){
        console.log("Hit a stop");
        stopAudio();
    });

    window.lPlayer.on("endExercise", function(){
        console.log("Got an END");
        stopAudio();
    });

    window.lPlayer.on("startExercise", function(){
        console.log("Got a startex");
        startAudio();
    });
}

function stopAudio(){
    // TODO use dep injection with these, callback that returns the object as param
    window.oscillator.disconnect();
    window.oscillator.stop();
}

function startAudio(){
    // TODO use dep injection with these, callback that returns the object as param
    window.oscillator = audioContext.createOscillator();
    window.oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
    window.oscillator.start();
    window.startLesson();
}

function loadNewLesson(aUser, aLesson){
    if (window.lPlayer) {  // for the case where we load a new lesson during play
        if (window.lPlayer.isPlaying) {
            window.lPlayer.stop();
        }
    }
    window.lPlayer = new Player(aUser, aLesson);
    window.initLessonCanvas();
}

window.curLesson = null;
// Canvas onClick, start the lesson
jQuery('#lesson').click(function(){
    loadNewLesson(users[0], window.curLesson);
    if (window.lPlayer) {
        console.log("Got a player");
        resetPlayerListeners();
        window.lPlayer.start();
    }
});

jQuery('#lesson-0').click(function(){
    window.curLesson = lessons[0];
    loadNewLesson(users[0], window.curLesson);
});

jQuery('#lesson-1').click(function(){
    window.curLesson = lessons[1];
    loadNewLesson(users[0], window.curLesson);
});

jQuery('#lesson-2').click(function(){
    window.curLesson = lessons[1];
    loadNewLesson(users[0], window.curLesson);
});


window.onload = function() {
    audioContext = new AudioContext();
    mpm = new MPM(audioContext.sampleRate, bufferLength);
    scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);

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

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // TODO fix the transition detection errors by averaging frames
        console.log("OnAudioProcess");
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        updatePitch(inputData);
    };
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
    mediaStreamSource.connect(scriptNode);
}

function updatePitch(buf) {
    var resultObj = mpm.detectPitch(buf);
    var pitchFreq = resultObj.getPitchFrequency();
    var probability = resultObj.getProbability();
    if (pitchFreq === -1 || probability < .95) {
        lastResult = -1;
    }
    else {
        var noteObj =  ntMaps.getClosestNoteFromPitch(pitchFreq);
        var noteName = noteObj.name;
        var curChart = window.lPlayer.getCurrentChart();
        var relativeItvl = curChart[noteName] + 1;
        if (relativeItvl){
            var detuneAmt = noteObj.getCentsDiff(pitchFreq);
            window.pitchYAxisRatio = relativeItvl + (detuneAmt / 100);
        }
        else {
            window.pitchYAxisRatio = null;
        }
        lastResult = 1;
    }
}