import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateUserIfNeeded } from '../actions/userActions.babel';
import ProfileForm from '../components/ProfileForm.babel';


class Profile extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(new_user_data) {
        this.props.dispatch(updateUserIfNeeded(new_user_data));
    }

    render() {
        return (
            <ProfileForm  doSubmit={ this.handleSubmit } />
        );
    }
}

export default connect()(Profile);
