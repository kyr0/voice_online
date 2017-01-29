'use strict';

var MPM = require('./MPM.js');
var Note = require('./Note.js');
var NoteMaps = require('./NoteMaps.js');

// TODO figure out "as needed" audio buffers, for instance buffers longer than 2 seconds
/* TODO -- "An important point to note is that on iOS, Apple currently mutes
   all sound output until the first time a sound is played during a user interaction event -
   for example, calling playSound() inside a touch event handler. You may struggle with Web Audio
   on iOS "not working" unless you circumvent this - in order to avoid problems like this, just
   play a sound (it can even be muted by connecting to a Gain Node with zero gain) inside an early
   UI event - e.g. "touch here to play"."
*/

function Audio(audioCtx = window.myAudioContext) {

    var player = null;
    var pianoBufferIdx = 0;
    var instrumentBuffers = null;
    var audioContext = audioCtx;
    var bufferLength = 1024;
    var scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);
    var mpm = new MPM(audioContext.sampleRate, bufferLength);
    var note = new Note('A4', '1/4');  // these values are not important, only necessary // TODO refactor Note class
    var nMaps = new NoteMaps();

    var accompany = null;
    var audioIn = null;

    this.currentNote = null;
    var currentChart = null;

    this.pianoBufferList = [];  // will host all the piano sound buffers that will be used in this lesson
    this.inputBuffer = null;
    this.inputData = null;
    this.resultObj = null;

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function (audioProcessingEvent) {
        // console.log('onaudioprocess');
        // TODO fix the note transition pitch detection errors by averaging frames
        this.inputBuffer = audioProcessingEvent.inputBuffer;
        this.inputData = this.inputBuffer.getChannelData(0);
        this._handleBuffer(this.inputData);
    }.bind(this);


    this._handleBuffer = function (buf) {
        // for speed perhaps mpm could return an array with pitch result, frequency, and probability
        this.resultObj = mpm.detectPitch(buf);
        this._processPitchResult(this.resultObj.getPitchFrequency(), this.resultObj.getProbability());
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
                note.frequency = nMaps.getClosestFreqFromPitch(pitchFreq); // so we don't need a new Note object
                var centsDiff = note.getCentsDiff(pitchFreq) / 100; // must be done after frequency is set on Note object
                var offPitchAmt = this.currentNote.getCentsDiff(pitchFreq);
                player.pitchYAxisRatio = relativeItvl + (centsDiff * -1);
                player.pushScore(offPitchAmt);
            } else {
                player.pitchYAxisRatio = null;
                player.pushScore(null);
            }
        }
    }.bind(this);


    // XXX This should be removed once we have samples longer than 2 seconds
    function getDuration(curNote) {
        if (curNote.durationInMilliseconds >= 2000) {
            return 2000 * 0.95;
        } else {
            return curNote.durationInMilliseconds;
        }
    }


    this.startNote = function (curNote) {
        this.currentNote = curNote;

        if (this.currentNote.name !== '-') {
            accompany = this.getNextPianoBuffer();
            accompany.volume.connect(audioContext.destination);

            // On the following line `getDuration() * 0.05) / 1000` represents rampDownGainTime
            setTimeout(this.rampGainDown.bind(null,
                ((getDuration(this.currentNote) * 0.05) / 1000), accompany), getDuration(this.currentNote));

            accompany.start(0);  // note: on older systems, may have to use deprecated noteOn()
        }
    }.bind(this);


    this.getNextPianoBuffer = function () {
        pianoBufferIdx++;
        return this.pianoBufferList[pianoBufferIdx - 1];
    }.bind(this);


    this.createPianoBufferList = function (thePlayer) {
        pianoBufferIdx = 0;
        for (var setIdx = 0; setIdx < thePlayer.sets.length; setIdx++) {
            for (var ntIdx = 0; ntIdx < thePlayer.sets[setIdx].noteList.length; ntIdx++) {
                var ntName = thePlayer.sets[setIdx].noteList[ntIdx].name;
                if (ntName !== '-') {
                    this.pianoBufferList.push(audioContext.createBufferSource());
                    var thisBuffer = this.pianoBufferList[this.pianoBufferList.length - 1];
                    thisBuffer.buffer = instrumentBuffers[ntName];
                    thisBuffer.volume = audioContext.createGain();
                    thisBuffer.connect(thisBuffer.volume);
                }
            }
        }
    }.bind(this);


    this.rampGainDown = function (durationInSeconds, accompany) {
        var gainValue = 0.001;
        accompany.volume.gain.exponentialRampToValueAtTime(gainValue, audioContext.currentTime + durationInSeconds);
        setTimeout(this.stopNote.bind(null, accompany), audioContext.currentTime + durationInSeconds);
    }.bind(this);


    this.stopNote = function (accompany) {
        accompany.stop();
        accompany.disconnect();
    };


    this.startSet = function (curSet) {
        currentChart = curSet.chart;
    };


    this.stopAudio = function () {
        if (this.currentNote.name !== '-') {
            this.stopNote(accompany);
            scriptNode.disconnect();
        }
        this.pianoBufferList = [];
    }.bind(this);


    this.startAudio = function (getSource) {
        // It's worth mentioning that startAudio() cannot be called unless
        //  both this.player and this.instrumentBuffers have been set.
        //  For more information see action - `setIsPlayingIfReady()`
        this.createPianoBufferList(player);
        getSource();
    };


    this.setInstrumentBuffers = function (buffers) {
        instrumentBuffers = buffers;
    };


    this.setPlayer = function (getSource, aPlayer) {
        player = aPlayer;

        player.on('startNote', function (curNote) {
            this.startNote(curNote);
        }.bind(this));

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
            console.log('SCORE: ' + aggNoteScore);
        }.bind(this));

    }.bind(this);


    // this.getTestInput = function () {
    //     var load = require('audio-loader');
    //     load(require('../../../test/fixtures/bad_practice.js')).then(
    //         function (buffer, time) {
    //             var testVoice = audioContext.createBufferSource();
    //             testVoice.buffer = buffer;
    //             testVoice.connect(audioContext.destination);
    //             testVoice.connect(scriptNode);
    //             scriptNode.connect(audioContext.destination);
    //             testVoice.start(time || audioContext.currentTime);
    //         }.bind(this)
    //     );
    // }.bind(this);
    //
    //
    // this.getSingleNoteTestInput = function () {
    //     audioIn = audioContext.createOscillator(); // always do this directly before osc.start()
    //     audioIn.start();
    //     audioIn.frequency.value = 369.99;
    //     audioIn.connect(scriptNode);
    //     scriptNode.connect(audioContext.destination);
    // };


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
