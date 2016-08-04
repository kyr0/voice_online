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


    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function (audioProcessingEvent) {
        // TODO fix the transition detection errors by averaging frames
        console.log('OnAudioProcess');
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        updatePitch(inputData);
    };


    function updatePitch(buf) {
        var resultObj = mpm.detectPitch(buf);
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
            var curChart = win.lPlayer.getCurrentChart();  // TODO set as a global and updated on every set event
            var relativeItvl = curChart[noteName] + 1;
            console.log("NOTE NAME: " + noteName + " REL ITV: " + relativeItvl);
            if (relativeItvl) {
                var offPitchAmt = noteObj.getCentsDiff(pitchFreq);
                // TODO basing this on offPitchAmt is wrong, should be on current set hi/lo freq,
                // TODO - ATM it's not visible if more the 50 cents off
                win.pitchYAxisRatio = relativeItvl + (offPitchAmt / 100);
                win.lPlayer.pushScore(offPitchAmt);
            }
            else {
                win.pitchYAxisRatio = null;
                win.lPlayer.pushScore(null);
            }
        }
    }


    function startNewNote(curNote) {  // formerly onStartNote event
        console.log("NEW NOTE");
        // win.oscillator.frequency.value = curNote.frequency;  // osc start frequency
        accompany.frequency.value = curNote.frequency;
    }


    function stopAudio() {
        console.log("STOP");
        accompany.stop();
        accompany.disconnect();
        // win.oscillator.disconnect();
        // win.oscillator.stop();
    }


    function startAudio() {
        console.log("START");
        accompany = audioContext.createOscillator();  // can't call start 2x on same osc
        accompany.start();
        accompany.connect(audioContext.destination);

        audioIn = audioContext.createOscillator(); // always do this directly before start
        audioIn.start();
        audioIn.frequency.value = 369.99;
        audioIn.connect(scriptNode);
        scriptNode.connect(audioContext.destination);

    }


    this.resetAudio = function(win, other_media) {
        // var connectionMedia = null;
        //
        // if (other_media) {
        //     connectionMedia = other_media;
        // }
        // else {
        //     connectionMedia = getUserInput();
        // }

        win.lPlayer.on('startNote', function (curNote) {
            startNewNote(curNote);
        });

        win.lPlayer.on('startExercise', function () {
            startAudio();
        });

        win.lPlayer.on('stopExercise', function () {
            stopAudio();
        });

        win.lPlayer.on('endExercise', function (aggNoteScore) {
            stopAudio(); // blinking timeDot could mean this was never run.
            console.log("SCORE: " + aggNoteScore);
        });

    };


    this.getTestInput = function () {
        accompany = audioContext.createOscillator();
        accompany.connect(scriptNode);
        accompany.start();
    }


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
