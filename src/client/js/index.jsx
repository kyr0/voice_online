'use strict';

var $ = require('jquery');

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import PIXI from '../../dependencies/pixi.min.js';

import Main from './Components/Main.jsx'
import Sing from './Components/Sing.jsx'
import Profile from './Components/Profile.jsx'


var Canvas = require('./Canvas.js');
var Audio = require('./Audio.js');

var canvas = new Canvas();
var audio = null;

// these window assignments must be done outside of onLoad
// for sharing with paper.js in case they are accessed before load
window.percentComplete = 0;
window.pitchFreq = -1;
window.lPlayer = null;
window.curLesson = null;

////////////////////////////////
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

stage.interactive = true;

var graphics = new PIXI.Graphics();

// set a fill and line style
graphics.beginFill(0xFF3300);
graphics.lineStyle(4, 0xffd900, 1);

// draw a shape
graphics.moveTo(50,50);
graphics.lineTo(250, 50);
graphics.lineTo(100, 100);
graphics.lineTo(50, 50);
graphics.endFill();

// set a fill and a line style again and draw a rectangle
graphics.lineStyle(2, 0x0000FF, 1);
graphics.beginFill(0xFF700B, 1);
graphics.drawRect(50, 250, 120, 120);

// draw a rounded rectangle
graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0xFF00BB, 0.25);
graphics.drawRoundedRect(150, 450, 300, 100, 15);
graphics.endFill();

// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
graphics.lineStyle(0);
graphics.beginFill(0xFFFF0B, 0.5);
graphics.drawCircle(470, 90,60);
graphics.endFill();


stage.addChild(graphics);

// run the render loop
animate();

function animate() {

    renderer.render(stage);
    requestAnimationFrame( animate );
}
////////////////////////////////

render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
            <Route path="/sing" component={Sing}/>
            <Route path="/profile" component={Profile}/>
        </Route>
    </Router>,
    document.getElementById('react-content')
);


// canvas onClick, start the lesson
$('#lesson').click(function(){
    console.log("JQUERY CLICK");
    canvas.initLesson();
    if (window.lPlayer) {
        audio.resetAudio(audio.getSingleNoteTestInput, window.lPlayer);
        // audio.resetAudio(audio.getUserInput);
        // audio.resetAudio(audio.getTestInput);
        window.lPlayer.start();
    }
});


$(document).ready(function() {
    audio = new Audio();  // AudioContext needs DOM (I think)
});