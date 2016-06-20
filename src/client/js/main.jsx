'use strict';

var $ = require('jquery');
var _ = require('lodash');

var React = require('react');
var ReactDOM = require('react-dom');
var LessonBox = require('./Components/LessonList.jsx')

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

var users = [];
users.push(new User('C3', 'C5'));


// Should slow down to bpm
lessons.push(new Lesson({
    title: 'Warmup - Skipping Lip Trill',
    noteList:
        [['-', '1'], ['D3', '1/8'], ['Gb3', '1/8'], ['E3', '1/8'],
        ['G3', '1/8'], ['Gb3', '1/8'], ['A3', '1/8'], ['G3', '1/8'], ['B3', '1/8'],
        ['A3', '1/8'], ['G3', '1/8'], ['Gb3', '1/8'], ['E3', '1/8'], ['D3', '1/2']],
    captionList: [['', '1'],['Brr', '2']],
    bpm: 110
}));

// Should cut off at the very end, see if 2.5 is an allowed length, add tests for float maybe?
lessons.push(new Lesson({
    title: 'Warmup - Major & Minor Octave Yaw',
    noteList:
        [['-', '1'], ['A2', '1/3'], ['Db3', '1/3'], ['E3', '1/3'],
        ['A3', '1/3'], ['E3', '1/3'], ['Db3', '1/3'], ['A2', '1/2']],
    captionList: [['', '1'],['Yaw', '2.5']]
}));


// fix this one up
lessons.push(new Lesson({
    title: 'Jumping Pattern \'Yaw\'',
    noteList:
        [['-', '1'], ['A3', '1/4'], ['E4', '1/4'], ['A4', '1/4'], ['E4', '1/4'],
        ['A3', '1/4'], ['E4', '1/4'], ['A4', '1/4'], ['E4', '1/4'],
        ['A3', '1/4'], ['E4', '1/4'], ['A4', '1/4'], ['E4', '1/4'],['A3', '3/4'],
        ['-', '1/4']],
    captionList: [['', '1'],['Yaw', '1'], ['Yaw', '1'],
        ['Yaw', '1/4'], ['Yaw', '1/4'], ['Yaw', '1/4'], ['Yaw', '1/4'], ['Yaw', '1/2'],
        ['THE END', '1/4']]
}));

lessons.push(new Lesson({
    title: '\'Ee\' Rapid Pattern Down',
    noteList:
        [['-', '1'],
            ['Bb3', '1/4'], ['A3', '1/12'], ['G3', '1/6'],
            ['A3', '1/4'], ['G3', '1/12'], ['F3', '1/6'],
            ['G3', '1/4'], ['F3', '1/12'], ['Eb3', '1/6'],
            ['F3', '1/4'], ['Eb3', '1/12'], ['D3', '1/6'],
            ['Eb3', '1/4'], ['D3', '1/12'], ['C3', '1/6'],
            ['D3', '1/4'], ['C3', '1/12'], ['Bb2', '1/6'],
            ['C3', '1/4'], ['Bb2', '1/12'], ['A2', '1/6'],['Bb2', '1/3']],
    captionList: [['', '1'],['Ee', '3'],['', '5/6']],
    bpm: 130

}));

// Should cut off at the very end
lessons.push(new Lesson({
    title: 'Agility w/ Rising Tones',
    noteList:
        [['-', '1'], ['B2', '1/6'], ['Db3', '1/6'], ['Eb3', '1/6'], ['E3', '1/2'],
            ['B2', '1/6'], ['Db3', '1/6'], ['Eb3', '1/6'], ['E3', '1/2'],
            ['B2', '1/6'], ['Db3', '1/6'], ['Eb3', '1/6'], ['E3', '1/2']],
    captionList: [['', '1'],['Ee', '1'],['Oo', '1'],['Ah', '1']]
}));


ReactDOM.render(
<LessonBox url="/api/lesson/" pollInterval={2000} />,
    document.getElementById('react-content')
);

// dynamically present all the lessons on the page
var domListItems = [];
domListItems.push('<ul>');
_.forEach(lessons, function(lesson, index) {
    var lessonId = 'lesson-'.concat(index);
    domListItems.push('<li><span id="'.concat(lessonId).concat('">').concat(lesson.title).concat('</span></li>'));
});
domListItems.push('</ul>');
$('#content').append(domListItems.join(''));

// make each dynamic item clickable
_.forEach(lessons, function(lesson, index) {
    var lessonId = '#lesson-'.concat(index);
    $(lessonId).click(function(){
        curLesson = lesson;
        initLesson(users[0], curLesson);
        console.log(curLesson.bpm);
    });
});

$(window).load(function() {
    // load the 1st lesson when page comes up
    curLesson = lessons[0];
    initLesson(users[0], curLesson);
});


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
$('#lesson').click(function(){
    initLesson(users[0], curLesson);
    if (window.lPlayer) {
        resetPlayerListenersInMain();
        window.lPlayer.start();
    }
});


$(document).ready(function() {
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