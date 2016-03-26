'use strict';

var MPM = require('./MPM.js');
var NoteMaps = require('./NoteMaps.js');
var Lesson = require('./Lesson.js');
var User = require('./User.js');
var Player = require('./Player.js');
var Soundfont = require('soundfont-player');

// these window assignments must be done outside of onLoad
// for sharing with paper.js in case they are accessed before load
window.percentComplete = 0;
window.pitchFreq = -1;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var soundfont = null;
var instrument = null;
var instNote = null;
var vca = null;

var bufferLength = 1024;
var scriptNode = null;
window.oscillator = null;
var mediaStreamSource = null;
var mpm = null;
var ntMaps = new NoteMaps();

var noteScores = [];
var setScores = [];
var lessonScores = [];

var lessons = [];

lessons.push(new Lesson({
    title: 'Fast as hell',
    noteList: [['A2', '1/32'], ['-', '1/32'], ['G2', '1/32'], ['A2', '1/32']]
}));
lessons.push(new Lesson({
    title: 'Plain Jane',
    noteList: [['A2', '1'], ['B2', '3'], ['G2', '1/4']]
}));
lessons.push(new Lesson({
    title: 'Jumping Yaw',
    noteList:
        [['-', '1'], ['A3', '1/4'], ['E4', '1/4'], ['A4', '1/4'], ['E4', '1/4'],
        ['A3', '1/4'], ['E4', '1/4'], ['A4', '1/4'], ['E4', '1/4'],
        ['A3', '1/4'], ['E4', '1/4'], ['A4', '1/4'], ['E4', '1/4'],['A3', '3/4'],
        ['-', '1/4']],
    captionList: [['', '1'],['Yaw', '1'], ['Yaw', '1'],
        ['Yaw', '1/4'], ['Yaw', '1/4'], ['Yaw', '1/4'], ['Yaw', '1/4'], ['Yaw', '1/2'],
        ['THE END', '1/4']]
}));

var users = [];
users.push(new User('A4', 'B5'));

window.lPlayer = null;

function resetPlayerListenersInMain(){
    window.lPlayer.on('startNote', function(curNote){
        if (instNote) {
            instNote.stop(0);
        }
        if (noteScores.length) {
            setScores.push(noteScores);
            noteScores = [];
        }
        var now = audioContext.currentTime;
        window.oscillator.frequency.value = curNote.frequency;  // osc start frequency
        instNote = instrument.play(curNote.name, now, -1);
    });

    window.lPlayer.on('endSet', function(){
        lessonScores.push(setScores);
        setScores = [];
    });

    window.lPlayer.on('stopExercise', function(){
        stopAudio();
    });

    window.lPlayer.on('endExercise', function(){
        stopAudio();
        for (var i = 0; i < lessonScores.length; i++) {
            console.log("Set #" + i + ": ");
            for (var j = 0; j < lessonScores[i].length; j++) {
                console.log("Note #" + j + " scores: " + lessonScores[i][j]);
            }
        }
    });

    window.lPlayer.on('startExercise', function(){
        noteScores = [];
        setScores = [];
        lessonScores = [];
        startAudio();
    });
}

function stopAudio(){
    if (instNote) {
        instNote.stop(0);
    }
    // TODO use dep injection with these, callback that returns the object as param
    window.oscillator.disconnect();
    window.oscillator.stop();
}

function startAudio(){
    // TODO use dep injection with these, callback that returns the object as param
    window.oscillator = audioContext.createOscillator();
    window.oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
    window.oscillator.start();
}

function initLesson(aUser, aLesson){
    if (window.lPlayer) {  // for the case where we load a new lesson during play
        if (window.lPlayer.isPlaying) {
            window.lPlayer.stop();
        }
    }
    window.lPlayer = new Player(aUser, aLesson);
    window.initLessonCanvas();
}

var curLesson = null;
// Canvas onClick, start the lesson
jQuery('#lesson').click(function(){
    initLesson(users[0], curLesson);
    if (window.lPlayer) {
        resetPlayerListenersInMain();
        window.lPlayer.start();
    }
});

jQuery('#lesson-0').click(function(){
    curLesson = lessons[0];
    initLesson(users[0], curLesson);
});

jQuery('#lesson-1').click(function(){
    curLesson = lessons[1];
    initLesson(users[0], curLesson);
});

jQuery('#lesson-2').click(function(){
    curLesson = lessons[2];
    initLesson(users[0], curLesson);
});

jQuery(window).load(function() {
    // load a lesson when page comes up
    curLesson = lessons[2];
    initLesson(users[0], curLesson);
});

jQuery(document).ready(function() {
    audioContext = new window.AudioContext();
    vca = audioContext.createGain();
    vca.gain.value = 8;
    vca.connect(audioContext.destination);
    soundfont = new Soundfont(audioContext);
    instrument = soundfont.instrument(null);
    mpm = new MPM(audioContext.sampleRate, bufferLength);
    scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);

    // get the mic
    //getUserMedia(
    //    {
    //        'audio': {
    //            'mandatory': {
    //                'googEchoCancellation': 'false',
    //                'googAutoGainControl': 'false',
    //                'googNoiseSuppression': 'false',
    //                'googHighpassFilter': 'false'
    //            },
    //            'optional': []
    //        }
    //    }, gotStream
    //);

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // TODO fix the transition detection errors by averaging frames
        //console.log('OnAudioProcess');
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        updatePitch(inputData);
    };

});


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
    if (pitchFreq === -1 || probability < 0.95) {
        window.pitchYAxisRatio = null;
        pushScore([null, null]);
    }
    else {
        var noteObj =  ntMaps.getClosestNoteFromPitch(pitchFreq);
        var noteName = noteObj.name;
        var curChart = window.lPlayer.getCurrentChart();
        var relativeItvl = curChart[noteName] + 1;
        if (relativeItvl){
            var offPitchAmt = noteObj.getCentsDiff(pitchFreq);
            window.pitchYAxisRatio = relativeItvl + (offPitchAmt / 100);
            pushScore([offPitchAmt, noteName]);
        }
        else {
            window.pitchYAxisRatio = null;
            pushScore([null, noteName]);
        }
    }
}

function pushScore(score) {
    noteScores.push(score);
}