'use strict';
var $ = require('jquery');

var MPM = require('./MPM.js');
var Note = require('./Note.js');

var Soundfont = require('soundfont-player');

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var soundfont = null;
var instrument = null;
var instNote = null;
var mpm = null;

var bufferLength = 1024;
var scriptNode = null;
window.oscillator = null;
var mediaStreamSource = null;

// MAKE THIS FALSE FOR LIVE VOICE TESTING
var test = true;

function startOscOnNewNote(curNote) {  // formerly onStartNote event
    // TODO use dep injection with Osc, callback that returns the object as param
    if (test) {
        window.oscillator.frequency.value = curNote.frequency;  // osc start frequency
    }
    if (instNote) {
        instNote.stop(0);
    }
    var now = audioContext.currentTime;
    instNote = instrument.play(curNote.name, now, -1);
}

function stopOsc(){ // formerly stopAudio()
    if (instNote) {
        instNote.stop(0);
    }
    // TODO use dep injection with Osc, callback that returns the object as param
    if (test) {
        window.oscillator.disconnect();
        window.oscillator.stop();
    }
}

function initOsc() {  // formerly startAudio()
    // TODO use dep injection with Osc, callback that returns the object as param
    if (test) {
        window.oscillator = audioContext.createOscillator();
        window.oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
        window.oscillator.start();
    }
}

function initAudio() {  // formerly document ready
    audioContext = new window.AudioContext();
    soundfont = new Soundfont(audioContext);
    instrument = soundfont.instrument(null);
    mpm = new MPM(audioContext.sampleRate, bufferLength);
    scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);
    if (!test) {
        getUserMedia();
    }
}

// TODO update this to use the most recent with polyfill for older browser versions
// - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
function getUserMedia() {
    var options = {
        'audio': {
            'mandatory': {
                'googEchoCancellation': 'false',
                    'googAutoGainControl': 'false',
                    'googNoiseSuppression': 'false',
                    'googHighpassFilter': 'false'
            },
            'optional': []
        }
    };

    function initStream(stream) {
        // Create an AudioNode from the stream.
        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        // Connect stream to the destination.
        mediaStreamSource.connect(scriptNode);
    }

    function error() {
        alert('Stream generation failed.');
    }

    try {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        navigator.getUserMedia(options, initStream, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}

function getMPM() {
    return mpm;
}

function getScriptNode() {
    return scriptNode;
}


function updatePitch(buf) {
    var resultObj = mpm.detectPitch(buf);
    var pitchFreq = resultObj.getPitchFrequency();
    var probability = resultObj.getProbability();
    if (pitchFreq === -1 || probability < 0.95) {
        window.pitchYAxisRatio = null;
        window.lPlayer.pushScore(null);
    }
    else {
        var noteObj =  new Note(pitchFreq);
        var noteName = noteObj.name;
        // The current chart is  used to show if the note is within
        // the visible bounds of the set that is playing.
        var curChart = window.lPlayer.getCurrentChart();
        var relativeItvl = curChart[noteName] + 1;
        if (relativeItvl){
            var offPitchAmt = noteObj.getCentsDiff(pitchFreq);
            window.pitchYAxisRatio = relativeItvl + (offPitchAmt / 100);
            window.lPlayer.pushScore(offPitchAmt);
        }
        else {
            window.pitchYAxisRatio = null;
            window.lPlayer.pushScore(null);
        }
    }
}


function resetAudio(){
    window.lPlayer.on('startNote', function(curNote){
        startOscOnNewNote(curNote);
    });

    window.lPlayer.on('startExercise', function(){
        initOsc();
    });

    window.lPlayer.on('stopExercise', function(){
        stopOsc();
    });

    window.lPlayer.on('endExercise', function(aggNoteScore){
        stopOsc(); // blinking timeDot could mean this was never run.
        console.log("SCORE: " + aggNoteScore);
    });
}


$(document).ready(function() {
    initAudio();
    scriptNode = getScriptNode();
    mpm = getMPM();

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // TODO fix the transition detection errors by averaging frames
        //console.log('OnAudioProcess');
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        updatePitch(inputData);
    };

});


module.exports = {
    resetAudio: resetAudio
};