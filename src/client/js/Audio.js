'use strict';

var MPM = require('./MPM.js');
var Note = require('./Note.js');
var NoteMaps = require('./NoteMaps.js');


// TODO make a way to destroy audioContext during tests AudioContext.close()
function Audio() {

    var player = null;
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var bufferLength = 1024;
    var scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);
    var mpm = new MPM(audioContext.sampleRate, bufferLength);
    var note = new Note('-', '1/4');  // these values are not important, only necessary, TODO refactor Note class
    var nMaps = new NoteMaps();

    var accompany = null;
    var audioIn = null;

    var currentNote = null;
    var currentChart = null;

    this.inputBuffer = null;
    this.inputData = null;
    this.resultObj = null;

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function (audioProcessingEvent) {
        // console.log('onaudioprocess');
        // TODO fix the transition detection errors by averaging frames
        this.inputBuffer = audioProcessingEvent.inputBuffer;
        this.inputData = this.inputBuffer.getChannelData(0);
        this._handleBuffer(this.inputData);
    }.bind(this);


    this._handleBuffer = function (buf) {
        // for speed perhaps mpm could return an array with frequency and probability
        this.resultObj = mpm.detectPitch(buf);
        var pitchFreq = this.resultObj.getPitchFrequency();
        var probability = this.resultObj.getProbability();
        this._processPitchResult(pitchFreq, probability);
    }.bind(this);


    this._processPitchResult = function (pitchFreq, probability) {
        if (pitchFreq === -1 || probability < 0.95) {
            player.pitchYAxisRatio = null;
            player.pushScore(null);  // this has 3 layers of depth
        } else {
            var noteName = note.getClosestNoteFromPitch(pitchFreq);
            // The current chart is  used to show if the note is within
            // the visible bounds of the set that is playing.
            var relativeItvl = currentChart[noteName] + 1;
            if (relativeItvl) {
                var offPitchAmt = currentNote.getCentsDiff(pitchFreq);
                note.frequency = nMaps.getClosestFreqFromPitch(pitchFreq); // so we don't need a new Note object
                player.pitchYAxisRatio = relativeItvl + (note.getCentsDiff(pitchFreq) / 100);
                player.pushScore(offPitchAmt);
            } else {
                player.pitchYAxisRatio = null;
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


    this.setPlayer = function (getSource, aPlayer) {
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
