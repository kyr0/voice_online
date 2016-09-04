import React, { Component, PropTypes } from 'react';

import Canvas from '../../Canvas.babel';
import { initialSingState } from '../reducers/reducers.babel';
import { GRID_SIZES } from '../../constants/constants.babel';

export default class Widget extends Component {

    constructor( props ) {
        super(props);
    }

    componentDidMount() {
        this.canvas = new Canvas(this.refs.canvasDiv);
    }

    componentWillReceiveProps(nextProps) {
        const { gridSize, user, currentLesson } = nextProps;
        if (gridSize) {
            if (gridSize !== this.props.gridSize) {
                this.canvas.setWidth(GRID_SIZES[gridSize]);
            }
        }

        if (user) {
            if (user !== this.props.user) {
                this.canvas.setUser(user);
            }
        }

        if (currentLesson !== initialSingState.currentLesson && currentLesson !== this.props.currentLesson) {
            this.canvas.setLesson(currentLesson);
        }
    }

    render() {
        const { gridSize } = this.props;
        const style = {
            width: GRID_SIZES[gridSize],
            float: 'none',
            margin: '0 auto',
        };
        return (
            <div className="canvas-container" ref="canvasDiv" style={style}>
                {null}
            </div>
        );
    }
}

Widget.propTypes = {
    user: PropTypes.object.isRequired,
    currentLesson: PropTypes.object.isRequired,
    gridSize: PropTypes.string.isRequired,
};
