'use strict';

import 'babel-polyfill';
// var $ = require('jquery');

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import Custom from '../custom.less';

import configureStore from './react/store/configureStore.babel';
import App from './react/containers/App.babel';
import Sing from './react/containers/Sing.babel';
import Profile from './react/containers/Profile.babel';

const store = configureStore();

render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Sing} />
                <Route path="/sing" component={Sing}/>
                <Route path="/profile" component={Profile}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('content'));


// var Canvas = require('./Canvas.js');
// var Audio = require('./Audio.js');
//
// var canvas = new Canvas();
// var audio = null;
//
// // these window assignments must be done outside of onLoad
// // for sharing with paper.js in case they are accessed before load
// window.percentComplete = 0;
// window.pitchFreq = -1;
// window.lPlayer = null;
// window.curLesson = null;
//

// render(
//     <Router history={hashHistory}>
//         <Route path="/" component={Main}>
//             <Route path="/sing" component={Sing}/>
//             <Route path="/profile" component={Profile}/>
//         </Route>
//     </Router>,
//     document.getElementById('react-content')
// );


// // canvas onClick, start the lesson
// $('#lesson').click(function(){
//     console.log("JQUERY CLICK");
//     canvas.initLesson();
//     if (window.lPlayer) {
//         audio.resetAudio(audio.getSingleNoteTestInput, window.lPlayer);
//         // audio.resetAudio(audio.getUserInput);
//         // audio.resetAudio(audio.getTestInput);
//         window.lPlayer.start();
//     }
// });


// $(document).ready(function() {
//     audio = new Audio();  // AudioContext needs DOM (I think)
// });
