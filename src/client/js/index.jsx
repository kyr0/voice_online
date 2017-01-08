'use strict';

import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import Custom from '../assets/custom.less';

import configureStore from './react/store/configureStore.babel';
import App from './react/containers/App.babel';
import Sing from './react/containers/Sing.babel';
import Profile from './react/containers/Profile.babel';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);


if ( !window.AudioContext && !window.webkitAudioContext ) {
    console.error('Web Audio API not supported in this browser');
} else {
    window.myAudioContext = new ( window.AudioContext || window.webkitAudioContext )();
}

render((
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Sing} />
                <Route path="/sing" component={Sing}/>
                <Route path="/sing/lesson/:lessonId" component={Sing}/>
                <Route path="/profile" component={Profile}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('content'));
