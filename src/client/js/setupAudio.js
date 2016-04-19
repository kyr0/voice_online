'use strict';

var MPM = require('./MPM.js');
var Soundfont = require('soundfont-player');

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var soundfont = null;
var instrument = null;
var instNote = null;
var vca = null;
var mpm = null;

var bufferLength = 1024;
var scriptNode = null;
window.oscillator = null;
var mediaStreamSource = null;

function startOscOnNewNote(curNote) {  // formerly onStartNote event
    window.oscillator.frequency.value = curNote.frequency;  // osc start frequency
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
    // TODO use dep injection with these, callback that returns the object as param
    window.oscillator.disconnect();
    window.oscillator.stop();
}

function initOsc(){  // formerly startAudio()
    // TODO use dep injection with these, callback that returns the object as param
    window.oscillator = audioContext.createOscillator();
    window.oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
    window.oscillator.start();
}

function initAudio(){  // formerly document ready
    audioContext = new window.AudioContext();
    vca = audioContext.createGain();
    vca.gain.value = 8;
    vca.connect(audioContext.destination);
    soundfont = new Soundfont(audioContext);
    instrument = soundfont.instrument(null);
    mpm = new MPM(audioContext.sampleRate, bufferLength);
    scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);

    //getUserMedia(); // this instead of oscillator

}

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

    function gotStream(stream) {
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
        navigator.getUserMedia(options, gotStream, error);
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
