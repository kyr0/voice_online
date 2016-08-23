import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getUserIfNeeded, updateUserIfNeeded } from '../actions/userActions.babel';
import { getLessons } from '../actions/lessonActions.babel';

import ProfileForm from '../components/ProfileForm.babel';
import LessonList from '../components/LessonList.babel';


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
        dispatch(getUserIfNeeded());
        dispatch(getLessons());
    }

    render() {
        const { user, lessons } = this.props;
        return (
            <div>
                <h1>Redux App</h1>
                <ProfileForm  doSubmit={ this.handleSubmit } />
                <LessonList user={ user } lessons={ lessons } />
            </div>
        );
    }
}


App.propTypes = {
    user: PropTypes.object,
    lessons: PropTypes.array,
};

const mapStateToProps = (state) => {
    return {
        user: state.profile.user,
        lessons: state.sing.lessons.results,
    };
};

export default connect(mapStateToProps)(App);
