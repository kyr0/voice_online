'use strict';

var MPM = require('./MPM.js');
var Note = require('./Note.js');
var NoteMaps = require('./NoteMaps.js');

// TODO figure out "as needed" audio buffers, for instance buffers longer than 2 seconds
// TODO make a way to destroy audioContext during tests AudioContext.close()
/* TODO -- "An important point to note is that on iOS, Apple currently mutes
   all sound output until the first time a sound is played during a user interaction event -
   for example, calling playSound() inside a touch event handler. You may struggle with Web Audio
   on iOS "not working" unless you circumvent this - in order to avoid problems like this, just
   play a sound (it can even be muted by connecting to a Gain Node with zero gain) inside an early
   UI event - e.g. "touch here to play"."
*/

function Audio() {

    var player = null;
    var instrumentBuffers = null;
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var bufferLength = 1024;
    var scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);
    var mpm = new MPM(audioContext.sampleRate, bufferLength);
    var note = new Note('A4', '1/4');  // these values are not important, only necessary // TODO refactor Note class
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
                note.frequency = nMaps.getClosestFreqFromPitch(pitchFreq); // so we don't need a new Note object
                var centsDiff = note.getCentsDiff(pitchFreq) / 100; // must be done after frequency is set on Note object
                var offPitchAmt = currentNote.getCentsDiff(pitchFreq);
                // console.log('Closest Note Freq: ' + note.frequency + ' OffBy: ' + centsDiff + ' Inc Pitch: ' + pitchFreq + ' Name: ' + noteName);
                // console.log('Pitch Axis Ratio: ' + (relativeItvl + (centsDiff * -1)) + ' Rl Itv: ' + relativeItvl + ' Off: ' + centsDiff);
                player.pitchYAxisRatio = relativeItvl + (centsDiff * -1);
                player.pushScore(offPitchAmt);
            } else {
                player.pitchYAxisRatio = null;
                player.pushScore(null);
            }
        }
    };


    function startNote(curNote) {
        currentNote = curNote;

        if (currentNote.name !== '-') {
            accompany = audioContext.createBufferSource();
            accompany.volume = audioContext.createGain();
            accompany.volume.connect(audioContext.destination);

            // DELETE
            audioIn = accompany; // always do this directly before osc.start()
            audioIn.connect(scriptNode);
            scriptNode.connect(audioContext.destination);

            accompany.buffer = instrumentBuffers[currentNote.name];
            accompany.connect(accompany.volume);

            // This will be removed once we have samples longer than 2 seconds
            var getDuration = function () {
                if (currentNote.durationInMilliseconds >= 2000) {
                    return 2000 * 0.95;
                } else {
                    return currentNote.durationInMilliseconds;
                }
            };

            var rampGainDownTime = (getDuration() * 0.05) / 1000;
            setTimeout(rampGainDown.bind(null, rampGainDownTime, accompany), getDuration());

            accompany.start(0);  // note: on older systems, may have to use deprecated noteOn(time)
        }
    }

    function rampGainDown(durationInSeconds, accompany) {
        var gainValue = 0.001;
        accompany.volume.gain.exponentialRampToValueAtTime(gainValue, audioContext.currentTime + durationInSeconds);
        setTimeout(stopNote.bind(null, accompany), audioContext.currentTime + durationInSeconds);
    }

    function stopNote(accompany) {
        accompany.stop();
        accompany.disconnect();
    }


    this.startSet = function (curSet) {
        currentChart = curSet.chart;
    };


    this.stopAudio = function () {
        stopNote(accompany);
        scriptNode.disconnect();
    };


    this.startAudio = function (getSource) {
        accompany = audioContext.createBufferSource();
        accompany.start();
        getSource();
    };


    this.setInstrumentBuffers = function (buffers) {
        instrumentBuffers = buffers;
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
            console.log('SCORE: ' + aggNoteScore);
        }.bind(this));

    }.bind(this);


    this.getTestInput = function () {
        // audioIn = accompany; // always do this directly before osc.start()
        // audioIn.connect(scriptNode);
        // scriptNode.connect(audioContext.destination);
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
