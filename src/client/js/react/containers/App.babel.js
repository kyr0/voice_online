import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getUserIfNeeded, updateUserIfNeeded } from '../actions/userActions.babel';
import { getLessons } from '../actions/lessonActions.babel';

import ProfileForm from '../components/ProfileForm.babel';


class App extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(new_user_data) {
        this.props.dispatch(updateUserIfNeeded(new_user_data));
    }

    componentDidMount() {
        const { dispatch } = this.props;
        console.log("HAY")
        console.log(this.props.user);
        console.log(this.props.isRequesting);
        dispatch(getUserIfNeeded());
        dispatch(getLessons());
    }

    render() {
        return (
            <div>
                <h1>Redux App</h1>
                <ProfileForm
                    doSubmit={ this.handleSubmit }
                />
            </div>
        );
    }
}


App.propTypes = {
    user: PropTypes.object,
    isRequesting: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        isRequesting: state.isRequesting,
    };
};

export default connect(mapStateToProps)(App);
