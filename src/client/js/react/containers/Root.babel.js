import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore.babel';
import App from './App.babel';

const store = configureStore();

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
