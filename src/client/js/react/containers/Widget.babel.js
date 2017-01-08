import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { initialLayoutState, initialSingState, initialProfileState } from '../reducers/reducers.babel';
import { GRID_SIZES } from '../../constants/constants.babel';
import { setIsPlayingIfReady } from '../actions/singActions.babel';
import Canvas from '../../Canvas.babel';
import Audio from '../../Audio.babel';
import User from '../../User';
import Lesson  from '../../Lesson';
import Player from '../../Player';


export class Widget extends Component {

    componentDidMount() {
        const { gridSize, user, currentLesson, instrumentBuffers } = this.props;
        this.audio = this.props.Audio ? new this.props.Audio() : new Audio();
        this.createCanvas(gridSize);

        if (instrumentBuffers !== initialSingState.instrumentBuffers) {
            this.audio.setInstrumentBuffers(instrumentBuffers);
        }

        if (user !== initialProfileState.user && currentLesson !== initialSingState.currentLesson) {
            this.createPlayer(user, currentLesson);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { gridSize, user, currentLesson, isPlaying, instrumentBuffers } = nextProps;
        const gridSizeProp = this.props.gridSize;
        const userProp = this.props.user;
        const currentLessonProp = this.props.currentLesson;
        const isPlayingProp = this.props.isPlaying;
        const instrumentBuffersProp = this.props.instrumentBuffers;

        if (instrumentBuffers !== instrumentBuffersProp) {
            this.audio.setInstrumentBuffers(instrumentBuffers);
        }

        if (gridSize !== gridSizeProp) {
            // Stop playing if size changes during session
            if (isPlayingProp) {
                this.player.stop();
                this.props.setIsPlayingIfReady(false);
            }
            this.createCanvas(gridSize);
            this.createPlayer(user, currentLesson);
        }

        if (isPlaying !== isPlayingProp) {
            if (isPlaying) {
                this.player.start();
            } else {
                this.player.stop();
                this.createCanvas(gridSizeProp);
                this.createPlayer(userProp, currentLessonProp);
            }
        }

        if (user !== userProp || currentLesson !== currentLessonProp) {
            this.createCanvas(gridSize);
            this.createPlayer(user, currentLesson);
        }
    }

    componentWillUnmount() {
        const { isPlaying, setIsPlayingIfReady } = this.props;
        if (isPlaying) {
            this.player.stop();
            setIsPlayingIfReady(false);
        }
    }

    render() {
        return (
            <div className="canvas-container" ref="canvasDiv">
                {null}
            </div>
        );
    }

    createCanvas(gridSize) {
        this.canvas = this.props.Canvas ? new this.props.Canvas() : new Canvas(this.refs.canvasDiv);
        if (gridSize !== initialLayoutState.gridSize) {
            this.canvas.setWidth(GRID_SIZES[gridSize]);
        }
    }

    createPlayer(userData, currentLessonData) {
        if (userData !== initialProfileState.user && currentLessonData !== initialSingState.currentLesson) {
            const user = this.props.User ? new this.props.User() : new User(userData.lower_range, userData.upper_range);
            const lesson = this.props.Lesson ? new this.props.Lesson() : new Lesson({
                title: currentLessonData.title,
                bpm: currentLessonData.bpm,
                noteList: currentLessonData.notes,
                captionList: currentLessonData.captions,
            });
            this.player = this.props.Player ? new this.props.Player() : new Player(user, lesson);
            this.canvas.setPlayer(this.player);
            this.audio.setPlayer(this.audio.getUserInput, this.player);
            // TODO refactor the event strings into constants
            this.setEndExerciseListener();
        }
    }

    setEndExerciseListener() {
        const { setIsPlayingIfReady } = this.props;
        this.player.on('endExercise', () => {
            setIsPlayingIfReady(false);
        });
    }
}

Widget.propTypes = {
    gridSize: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    currentLesson: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    instrumentBuffers: PropTypes.object.isRequired,
    setIsPlayingIfReady: PropTypes.func.isRequired,
    // the following optional allow for dependency injection, useful for testing
    Canvas: PropTypes.func,
    Audio: PropTypes.func,
    User: PropTypes.func,
    Lesson: PropTypes.func,
    Player: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        gridSize: state.layout.gridSize,
        user: state.profile.user,
        currentLesson: state.sing.currentLesson,
        isPlaying: state.sing.isPlaying,
        instrumentBuffers: state.sing.instrumentBuffers,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setIsPlayingIfReady }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Widget);