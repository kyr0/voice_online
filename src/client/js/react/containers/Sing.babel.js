import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { setCurrentLesson } from '../actions/lessonActions.babel';
import LessonList from '../components/LessonList.babel';


class Sing extends Component {

    constructor(props) {
        super(props);
        this.handleLessonSelect = this.handleLessonSelect.bind(this);
    }

    handleLessonSelect(lessonData) {
        this.props.dispatch(setCurrentLesson(lessonData));
    }

    render() {
        const { user, lessons, currentLesson } = this.props;
        return (
             <LessonList
                 user={ user }
                 lessons={ lessons }
                 currentLesson={ currentLesson }
                 doLessonSelect={ this.handleLessonSelect }
             />
        );
    }
}


Sing.propTypes = {
    user: PropTypes.object,
    lessons: PropTypes.array,
    currentLesson: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        user: state.profile.user,
        lessons: state.sing.lessons.results,
        currentLesson: state.sing.currentLesson,
    };
};

export default connect(mapStateToProps)(Sing);
