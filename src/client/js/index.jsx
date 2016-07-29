'use strict';

var $ = require('jquery');

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import Main from './Components/Main.jsx'
import Sing from './Components/Sing.jsx'
import Profile from './Components/Profile.jsx'

var NoteMaps = require('./NoteMaps.js');
var Lesson = require('./Lesson.js');
var User = require('./User.js');
var Player = require('./Player.js');

var audio = require('./setupAudio');
var canvasMgr = require('./canvasManager.js');


// these window assignments must be done outside of onLoad
// for sharing with paper.js in case they are accessed before load
window.percentComplete = 0;
window.pitchFreq = -1;
window.lPlayer = null;
window.curLesson = null;


var mpm = null;
var scriptNode = null;

var ntMaps = new NoteMaps();


render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}/>
        <Route path="/sing" component={Sing}/>
        <Route path="/profile" component={Profile}/>
    </Router>,
    document.getElementById('react-content')
);


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
        audio.stopOsc(); // blinking timeDot could mean this was never run.
        console.log("SCORE: " + aggNoteScore);
    });

}


// Canvas onClick, start the lesson
$('#lesson').click(function(){
    canvasMgr.initLesson(window.curLesson);
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