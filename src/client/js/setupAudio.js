'use strict';

var MPM = require('./MPM.js');
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

module.exports = {
    getMPM: getMPM,
    getScriptNode: getScriptNode,
    initAudio: initAudio,
    initOsc: initOsc,
    stopOsc: stopOsc,
    startOscOnNewNote: startOscOnNewNote,
};
