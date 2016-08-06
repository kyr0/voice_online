'use strict';

var MPM = require('./MPM.js');
var Note = require('./Note.js');


function Audio (win) {
    var audioContext = new (win.AudioContext || win.webkitAudioContext)();
    var bufferLength = 1024;
    var scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);
    var mpm = new MPM(audioContext.sampleRate, bufferLength);

    var accompany = null;
    var audioIn = null;

    var currentNote = null;
    var currentChart = null;

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function (audioProcessingEvent) {
        // TODO fix the transition detection errors by averaging frames
        console.log('OnAudioProcess');
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        updatePitch(inputData);
    };


    function updatePitch(buf) {
        var resultObj = mpm.detectPitch(buf);  // this could return an array with frequency and probability, faster
        var pitchFreq = resultObj.getPitchFrequency();
        var probability = resultObj.getProbability();
        if (pitchFreq === -1 || probability < 0.95) {
            win.pitchYAxisRatio = null;
            win.lPlayer.pushScore(null);
        }
        else {
            var noteObj = new Note(pitchFreq);
            var noteName = noteObj.name;
            // The current chart is  used to show if the note is within
            // the visible bounds of the set that is playing.
            var relativeItvl = currentChart[noteName] + 1;
            if (relativeItvl) {
                var offPitchAmt = currentNote.getCentsDiff(pitchFreq);
                win.pitchYAxisRatio = relativeItvl + (noteObj.getCentsDiff(pitchFreq) / 100);
                win.lPlayer.pushScore(offPitchAmt);
            }
            else {
                win.pitchYAxisRatio = null;
                win.lPlayer.pushScore(null);
            }
        }
    }


    function startNote(curNote) {
        currentNote = curNote;
        accompany.frequency.value = currentNote.frequency;
    }


    function startSet(curSet) {
        currentChart = curSet.chart;
    }


    function stopAudio() {
        accompany.stop();
        accompany.disconnect();
        scriptNode.disconnect();
    }


    function startAudio(getSource) {
        accompany = audioContext.createOscillator();  // can't call start 2x on same osc
        accompany.start();
        accompany.connect(audioContext.destination);
        getSource();
    }


    this.resetAudio = function(win, getSource) {

        win.lPlayer.on('startNote', function (curNote) {
            startNote(curNote);
        });

        win.lPlayer.on('startSet', function (curSet) {
            startSet(curSet);
        });

        win.lPlayer.on('startExercise', function () {
            startAudio(getSource);
        });

        win.lPlayer.on('stopExercise', function () {
            stopAudio();
        });

        win.lPlayer.on('endExercise', function (aggNoteScore) {
            stopAudio();
            console.log("SCORE: " + aggNoteScore);
        });

    };


    this.getTestInput = function () {
        audioIn = accompany; // always do this directly before osc.start()
        audioIn.connect(scriptNode);
        scriptNode.connect(audioContext.destination);
    };

    this.getSingleNoteTestInput = function () {
        audioIn = audioContext.createOscillator(); // always do this directly before osc.start()
        audioIn.start();
        audioIn.frequency.value = 369.99;
        audioIn.connect(scriptNode);
        scriptNode.connect(audioContext.destination);
    };


    this.getUserInput = function () {
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
            audioIn = audioContext.createMediaStreamSource(stream);
            audioIn.connect(scriptNode);
            scriptNode.connect(audioContext.destination);
        }

        function error() {
            alert('Stream generation failed.');
        }

        try {
            // TODO update this to use the most recent with polyfill for older browser versions
            // - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
            navigator.getUserMedia = (
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia );
            navigator.getUserMedia(options, initStream, error);
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }

    }


}

module.exports = Audio;
