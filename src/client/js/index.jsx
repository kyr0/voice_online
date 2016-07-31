'use strict';

var $ = require('jquery');

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import Main from './Components/Main.jsx'
import Sing from './Components/Sing.jsx'
import Profile from './Components/Profile.jsx'


var canvasMgr = require('./canvasManager.js');
var audioMgr = require('./audioManager.js');


// these window assignments must be done outside of onLoad
// for sharing with paper.js in case they are accessed before load
window.percentComplete = 0;
window.pitchFreq = -1;
window.lPlayer = null;
window.curLesson = null;


render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
            <Route path="/sing" component={Sing}/>
            <Route path="/profile" component={Profile}/>
        </Route>
    </Router>,
    document.getElementById('react-content')
);



// Canvas onClick, start the lesson
$('#lesson').click(function(){
    console.log("JQUERY CLICK");
    canvasMgr.initLesson();
    if (window.lPlayer) {
        audioMgr.resetAudio();
        window.lPlayer.start();
    }
});

