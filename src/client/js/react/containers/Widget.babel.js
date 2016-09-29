import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { initialLayoutState, initialSingState, initialProfileState } from '../reducers/reducers.babel';
import { GRID_SIZES } from '../../constants/constants.babel';
import { setIsPlayingIfReady } from '../actions/singActions.babel';
import Canvas from '../../Canvas.babel';
import Audio from '../../Audio';
import User from '../../User';
import Lesson  from '../../Lesson';
import Player from '../../Player';


export class Widget extends Component {

    componentDidMount() {
        const { gridSize, user, currentLesson } = this.props;
        this.canvas = new Canvas(this.refs.canvasDiv);
        this.audio = new Audio();
        if (gridSize !== initialLayoutState.gridSize) {
            this.setCanvasWidth(GRID_SIZES[gridSize]);
        }

        if (user !== initialProfileState.user && currentLesson !== initialSingState.currentLesson) {
            this.createPlayer(user, currentLesson);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { gridSize, user, currentLesson, isPlaying } = nextProps;

        if (gridSize !== this.props.gridSize) {
            this.setCanvasWidth(GRID_SIZES[gridSize]);
        }

        // this must take place before createPlayer call
        if (isPlaying !== this.props.isPlaying) {
            isPlaying ? this.player.start() : this.player.stop();
        }

        if (user !== initialProfileState.user && currentLesson !== initialSingState.currentLesson) {
            if (user !== this.props.user || currentLesson !== this.props.currentLesson) {
                this.createPlayer(user, currentLesson);
            }
        }
    }

    componentWillUnmount() {
        const { setIsPlayingIfReady } = this.props;
        if (this.props.isPlaying) {
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

    setCanvasWidth(width) {
        this.canvas.setWidth(width);
    }

    createPlayer(theUser, currentLesson) {
        const user = new User(theUser.lower_range, theUser.upper_range);
        const lesson = new Lesson({
            title: currentLesson.title,
            bpm: currentLesson.bpm,
            noteList: currentLesson.notes,
            captionList: currentLesson.captions,
        });
        this.player = new Player(user, lesson);
        this.canvas.setPlayer(this.player);
        this.audio.setPlayer(this.audio.getTestInput, this.player);
        // TODO refactor the event strings into constants
        this.setEndExerciseListener();
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
    setIsPlayingIfReady: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        gridSize: state.layout.gridSize,
        user: state.profile.user,
        currentLesson: state.sing.currentLesson,
        isPlaying: state.sing.isPlaying,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setIsPlayingIfReady }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Widget);