import React, { Component } from 'react';
import { connect } from 'react-redux';
import load  from 'audio-loader';

import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

import { getUserIfNeeded } from '../actions/userActions.babel';
import { getLessons } from '../actions/singActions.babel';
import { getInstrument, getLessons } from '../actions/singActions.babel';


class App extends Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUserIfNeeded());
        dispatch(getLessons());
        dispatch(getInstrument(load));
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
