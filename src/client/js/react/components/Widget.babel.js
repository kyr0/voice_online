import React, { Component, PropTypes } from 'react';

import Canvas from '../../Canvas.babel';
import { initialLayoutState, initialSingState, initialProfileState } from '../reducers/reducers.babel';
import { GRID_SIZES } from '../../constants/constants.babel';

export default class Widget extends Component {

    constructor( props ) {
        super(props);
    }

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
        const { gridSize, user, currentLesson } = nextProps;
        if (gridSize !== this.props.gridSize) {
            this.setCanvasWidth(gridSize);
        }

        if (user !== this.props.user) {
            this.setCanvasUser(user);
        }

        if (currentLesson !== this.props.currentLesson) {
            this.setCanvasLesson(currentLesson);
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
};
