import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { initialSingState } from '../reducers/reducers.babel';
import SingPage from '../components/SingPage.babel';

import {
    setCurrentLesson,
    nextLesson,
    previousLesson,
    setIsPlayingIfReady,
    getIdFromLesson,
    getLessonById,
} from '../actions/singActions.babel';
import { updateGridSizeIfNeeded } from '../actions/windowActions.babel';

export class Sing extends Component {

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleLessonSelect = this.handleLessonSelect.bind(this);
        this.handlePreviousLessonSelect = this.handlePreviousLessonSelect.bind(this);
        this.handlePlayLessonSelect = this.handlePlayLessonSelect.bind(this);
        this.handleNextLessonSelect = this.handleNextLessonSelect.bind(this);
    }

    componentDidMount() {

    }

    componentWillMount() {
        const { currentLesson, dispatch } = this.props;
        if (currentLesson !== initialSingState.currentLesson) {
            const lessonId = getIdFromLesson(currentLesson);
            dispatch(replace('/sing/lesson/' + lessonId));
        }

        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillReceiveProps(nextProps) {
        const { params } = nextProps;
        const newLessonId = params.lessonId;
        const curLessonId = this.props.params.lessonId;
        // Set current lesson using URL when user clicks browser back/forward
        // TODO test this
        if (curLessonId !== newLessonId && newLessonId !== undefined) {
            this.props.dispatch(setCurrentLesson(getLessonById(this.props.lessons, newLessonId)));
        }
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
        const { lessons, currentLesson, isPlaying } = this.props;
        return (
            <SingPage
                lessons={ lessons }
                currentLesson={ currentLesson }
                isPlaying={ isPlaying }
                doLessonSelect={ this.handleLessonSelect }
                doNextLessonSelect={ this.handleNextLessonSelect }
                doPreviousLessonSelect={ this.handlePreviousLessonSelect }
                doPlayLessonSelect={ this.handlePlayLessonSelect }
            />
        );
    }
}


Sing.propTypes = {
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        lessons: state.sing.lessons.results,
        currentLesson: state.sing.currentLesson,
        isPlaying: state.sing.isPlaying,
    };
};

export default connect(mapStateToProps)(Sing);
