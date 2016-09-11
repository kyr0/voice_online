'use strict';

var MPM = require('./MPM.js');
var Note = require('./Note.js');


function Audio() {

    var player = null;
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var bufferLength = 1024;
    var scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);
    var mpm = new MPM(audioContext.sampleRate, bufferLength);

    var accompany = null;
    var audioIn = null;

    var currentNote = null;
    var currentChart = null;


    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function (audioProcessingEvent) {
        // console.log('onaudioprocess');
        // TODO fix the transition detection errors by averaging frames
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        this.handleBuffer(inputData);
    }.bind(this);


    this.handleBuffer = function (buf) {
        var resultObj = mpm.detectPitch(buf);  // this could return an array with frequency and probability, faster
        var pitchFreq = resultObj.getPitchFrequency();
        var probability = resultObj.getProbability();
        this._processPitchResult(pitchFreq, probability);
    }.bind(this);


    this._processPitchResult = function (pitchFreq, probability) {
        if (pitchFreq === -1 || probability < 0.95) {
            window.pitchYAxisRatio = null;
            player.pushScore(null);
        } else {
            var noteObj = new Note(pitchFreq);
            var noteName = noteObj.name;
            // The current chart is  used to show if the note is within
            // the visible bounds of the set that is playing.
            var relativeItvl = currentChart[noteName] + 1;
            if (relativeItvl) {
                var offPitchAmt = currentNote.getCentsDiff(pitchFreq);
                window.pitchYAxisRatio = relativeItvl + (noteObj.getCentsDiff(pitchFreq) / 100);
                player.pushScore(offPitchAmt);
            } else {
                window.pitchYAxisRatio = null;
                player.pushScore(null);
            }
        }
    };


    function startNote(curNote) {
        currentNote = curNote;
        accompany.frequency.value = currentNote.frequency;
    }


    this.startSet = function (curSet) {
        currentChart = curSet.chart;
    };


    this.stopAudio = function () {
        accompany.stop();
        accompany.disconnect();
        scriptNode.disconnect();
    };


    this.startAudio = function (getSource) {
        accompany = audioContext.createOscillator();  // must be new, can't call start 2x on same osc
        accompany.start();
        accompany.connect(audioContext.destination);
        getSource();
    };


    this.resetAudio = function (getSource, aPlayer) {
        player = aPlayer;

        player.on('startNote', function (curNote) {
            startNote(curNote);
        });

        player.on('startSet', function (curSet) {
            this.startSet(curSet);
        }.bind(this));

        player.on('startExercise', function () {
            this.startAudio(getSource);
        }.bind(this));

        player.on('stopExercise', function () {
            this.stopAudio();
        }.bind(this));

        player.on('endExercise', function (aggNoteScore) {
            this.stopAudio();
            console.log('SCORE: ' + aggNoteScore);
        }.bind(this));

    }.bind(this);


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
                    'googHighpassFilter': 'false',
                },
                'optional': [],
            },
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

    };

}

module.exports = Audio;
