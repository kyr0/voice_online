import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { initialLayoutState, initialSingState, initialProfileState } from '../reducers/reducers.babel';
import { GRID_SIZES } from '../../constants/constants.babel';
import { setIsPlayingIfReady } from '../actions/singActions.babel';
import Canvas from '../../Canvas.babel';
import Audio from '../../Audio';


export class Widget extends Component {

// window.percentComplete = 0;
// window.pitchFreq = -1;
//     canvas.initLesson();
//     if (window.lPlayer) {
//         audio.resetAudio(audio.getSingleNoteTestInput, window.lPlayer);
//         // audio.resetAudio(audio.getUserInput);
//         // audio.resetAudio(audio.getTestInput);
//         window.lPlayer.start();
//     }


    componentDidMount() {
        const { gridSize, user, currentLesson } = this.props;
        this.canvas = new Canvas(this.refs.canvasDiv);
        this.audio = new Audio();
        if (gridSize !== initialLayoutState.gridSize) {
            this.setCanvasWidth(gridSize);
        }

        if (user !== initialProfileState.user ) {
            this.setCanvasUser(user);
        }

        if (currentLesson !== initialSingState.currentLesson) {
            this.setCanvasLesson(currentLesson);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { gridSize, user, currentLesson, isPlaying } = nextProps;
        if (gridSize !== this.props.gridSize) {
            this.setCanvasWidth(gridSize);
        }

        if (user !== this.props.user) {
            this.setCanvasUser(user);
        }

        if (currentLesson !== this.props.currentLesson) {
            this.setCanvasLesson(currentLesson);
        }

        if (user !== initialProfileState.user && currentLesson !== initialSingState.currentLesson) {
            // ToDO remove User and Lesson from Canvas, create Player here and inject it into Canvas
            console.log('HEY OIUOIUAOSIDUOAISAOIUD');
        }

        // if (isPlaying !== this.props.isPlaying) {
        //     isPlaying ? this.player.start() : this.player.stop();
        // }
    }

    componentWillUnmount() {
        this.props.dispatch(setIsPlayingIfReady(false));
    }

    render() {
        return (
            <div className="canvas-container" ref="canvasDiv">
                {null}
            </div>
        );
    }

    setCanvasWidth(gridSize) {
        this.canvas.setWidth(GRID_SIZES[gridSize]);
    }
    setCanvasUser(user) {
        this.canvas.setUser(user);
    }
    setCanvasLesson(currentLesson) {
        this.canvas.setLesson(currentLesson);
    }
}

Widget.propTypes = {
    gridSize: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    currentLesson: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    return {
        gridSize: state.layout.gridSize,
        user: state.profile.user,
        currentLesson: state.sing.currentLesson,
        isPlaying: state.sing.isPlaying,
    };
};

export default connect(mapStateToProps)(Widget);