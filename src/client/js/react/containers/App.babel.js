import React, { Component } from 'react';
import { connect } from 'react-redux';
import load  from 'audio-loader';

import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, NavItem, Nav } from 'react-bootstrap';

import { getUserIfNeeded, isAuthenticated } from '../actions/userActions.babel';
import { getInstrument, getLessons } from '../actions/singActions.babel';
import LoginForm from '../components/LoginForm.babel';

class App extends Component {

    constructor(props) {
        super(props);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUserIfNeeded());
        dispatch(getLessons());
        dispatch(getInstrument(load));
    }

    handleLoginSubmit(loginData) {
        console.log('Hey, I am logging in yeah!');
        console.log(loginData);
    }

    onLogout() {
        location.reload();
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
                        { isAuthenticated() ? (
                            <Navbar.Collapse>
                                <Nav pullRight>
                                    <LinkContainer to="/sing" ><NavItem eventKey={1} > Sing </NavItem></LinkContainer>
                                    <LinkContainer to="/profile" ><NavItem eventKey={2} > Profile </NavItem></LinkContainer>
                                    <NavItem eventKey={3} onClick={this.onLogout} > Logout </NavItem>
                                </Nav>
                            </Navbar.Collapse>

                        ) : (
                            <Navbar.Form pullRight>
                                <LoginForm  doSubmit={ this.handleLoginSubmit } />
                                {/*<NavItem eventKey={2} onClick={this.onLogout} > Login </NavItem>*/}
                            </Navbar.Form>
                        )}
                </Navbar>
                { this.props.children }
            </div>
        );
    }
}

export default connect()(App);
