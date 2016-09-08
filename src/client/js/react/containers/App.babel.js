import React, { Component } from 'react';
import { connect } from 'react-redux';

import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

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
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Pure Voice Pro</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <LinkContainer to="/sing" ><NavItem eventKey={1} > Sing </NavItem></LinkContainer>
                            <LinkContainer to="/profile" ><NavItem eventKey={2} > Profile </NavItem></LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                { this.props.children }
            </div>
        );
    }
}

export default connect()(App);

// https://fonts.google.com/specimen/Raleway?selection.family=Raleway:100
// https://github.com/typekit/webfontloader
// import WebFont  from 'webfontloader';
//
// let isFontLoaded = null;
// let fontName = null;
// const WebFontConfig = {
//     loading: () => {
//         isFontLoaded = false;
//     },
//     active: () => {
//         isFontLoaded = true;
//         initialize();
//     },
//     inactive: function () {
//     },
// };
//
// WebFont.load({
//     google: {
//         families: ['Raleway:100'],
//     },
// });