'use strict';

var NoteMaps = require('./NoteMaps.js');
var Lesson = require('./Lesson.js');
var User = require('./User.js');
var Player = require('./Player.js');
var audio = require('./setupAudio');

// these window assignments must be done outside of onLoad
// for sharing with paper.js in case they are accessed before load
window.percentComplete = 0;
window.pitchFreq = -1;

var mpm = null;
var scriptNode = null;

var ntMaps = new NoteMaps();
var lessons = [];

lessons.push(new Lesson({
    title: 'Fast as hell',
    noteList: [['A2', '1/16'], ['-', '1/16'], ['G2', '1/16'], ['A2', '1/16']]
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
users.push(new User('G3', 'G4'));

window.lPlayer = null;

function resetPlayerListenersInMain(){

    window.lPlayer.on('startNote', function(curNote){
        audio.startOscOnNewNote(curNote);
    });

    window.lPlayer.on('startExercise', function(){
        audio.initOsc();
    });

    window.lPlayer.on('stopExercise', function(){
        audio.stopOsc();
    });

    window.lPlayer.on('endExercise', function(aggNoteScore){
        audio.stopOsc(); // blinking timeDot means this was never run.
        console.log("SCORE: " + aggNoteScore);
    });

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
    audio.initAudio();
    scriptNode = audio.getScriptNode();
    mpm = audio.getMPM();

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // TODO fix the transition detection errors by averaging frames
        //console.log('OnAudioProcess');
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        updatePitch(inputData);
    };

});


function updatePitch(buf) {
    var resultObj = mpm.detectPitch(buf);
    var pitchFreq = resultObj.getPitchFrequency();
    var probability = resultObj.getProbability();
    if (pitchFreq === -1 || probability < 0.95) {
        window.pitchYAxisRatio = null;
        pushScore(null);
    }
    else {
        var noteObj =  ntMaps.getClosestNoteFromPitch(pitchFreq);
        var noteName = noteObj.name;
        // The current chart is  used to show if the note is within
        // the visible bounds of the set that is playing.
        var curChart = window.lPlayer.getCurrentChart();
        var relativeItvl = curChart[noteName] + 1;
        if (relativeItvl){
            var offPitchAmt = noteObj.getCentsDiff(pitchFreq);
            window.pitchYAxisRatio = relativeItvl + (offPitchAmt / 100);
            pushScore(offPitchAmt);
        }
        else {
            window.pitchYAxisRatio = null;
            pushScore(null);
        }
    }
}

function pushScore(score) {
    window.lPlayer.pushScore(score);
}