import React, { Component, PropTypes } from 'react';

import Canvas from '../../Canvas.babel';
import { initialLayoutState, initialSingState, initialProfileState } from '../reducers/reducers.babel';
import { GRID_SIZES } from '../../constants/constants.babel';

export default class Widget extends Component {

    componentDidMount() {
        const { gridSize, user, currentLesson } = this.props;
        this.canvas = new Canvas(this.refs.canvasDiv);
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

        if (!isPlaying) {
            // call the start and stop actions from this place
            // TODO this does not fire when unmounting, will need to define our own componentWillUnmount
            // do this by making this a container for Widget which defines it only once, remove it from the sing container
            // remove the unique props from the sing container and put in Widget container
        }
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
