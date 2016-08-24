import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getUserIfNeeded } from '../actions/userActions.babel';
import { getLessons } from '../actions/lessonActions.babel';


class App extends Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUserIfNeeded());
        dispatch(getLessons());
    }

    render() {
        return (
            <div>
                <h1>Pure Voice</h1>
                <ul role="nav">
                    <li><Link to="/sing">Sing</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
                { this.props.children }
            </div>
        );
    }
}

export default connect()(App);
