import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SingPage from '../components/SingPage.babel';

import { setCurrentLesson, nextLesson, previousLesson, setIsPlayingIfReady } from '../actions/singActions.babel';
import { updateGridSizeIfNeeded } from '../actions/windowActions.babel';

class Sing extends Component {

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleLessonSelect = this.handleLessonSelect.bind(this);
        this.handlePreviousLessonSelect = this.handlePreviousLessonSelect.bind(this);
        this.handlePlayLessonSelect = this.handlePlayLessonSelect.bind(this);
        this.handleNextLessonSelect = this.handleNextLessonSelect.bind(this);
    }

    componentWillMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        const { dispatch } = this.props;
        dispatch(updateGridSizeIfNeeded());
    }

    handleLessonSelect(lessonData) {
        this.props.dispatch(setCurrentLesson(lessonData));
    }

    handleNextLessonSelect() {
        this.props.dispatch(nextLesson());
    }

    handlePreviousLessonSelect() {
        this.props.dispatch(previousLesson());
    }

    handlePlayLessonSelect() {
        const { dispatch, isPlaying } = this.props;
        dispatch(setIsPlayingIfReady(!isPlaying));
    }


    render() {
        const { user, lessons, currentLesson, gridSize } = this.props;
        return (
            <SingPage
                user={user}
                lessons={lessons}
                currentLesson={currentLesson}
                gridSize={gridSize}
                doLessonSelect={ this.handleLessonSelect }
                doNextLessonSelect={ this.handleNextLessonSelect }
                doPreviousLessonSelect={ this.handlePreviousLessonSelect }
                doPlayLessonSelect={ this.handlePlayLessonSelect }
            />
        );
    }
}


Sing.propTypes = {
    user: PropTypes.object.isRequired,
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
    gridSize: PropTypes.string.isRequired,
    isPlaying: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.profile.user,
        lessons: state.sing.lessons.results,
        currentLesson: state.sing.currentLesson,
        isPlaying: state.sing.isPlaying,
        gridSize: state.layout.gridSize,
    };
};

export default connect(mapStateToProps)(Sing);
