import React, { Component, PropTypes } from 'react';
import PIXI from '../../../../dependencies/pixi.min.js';

import { GRID_SIZES } from '../../constants/constants.babel';

export default class Canvas extends Component {

    constructor( props ) {
        super(props);
        this.animate = this.animate.bind(this);
        this.canvasInit = this.canvasInit.bind(this);
        this.gridSize = null;
    }

    /**
     * In this case, componentDidMount is used to grab the canvas container ref, and
     * and hook up the PixiJS renderer
     **/
    componentDidMount() {
        const { gridSize } = this.props;
        if (gridSize) {
            this.canvasInit(GRID_SIZES[gridSize]);
        }
    }


    componentWillReceiveProps(nextProps) {
        const { gridSize } = nextProps;
        if (gridSize) {
            if (gridSize !== this.props.gridSize) {
                this.canvasInit(GRID_SIZES[gridSize]);
            }
        }
    }


    /**
     * Render our container that will store our PixiJS game canvas. Store the ref
     **/
    render() {
        const { user, gridSize } = this.props;
        const style = {
            width: GRID_SIZES[gridSize],
            float: 'none',
            margin: '0 auto',
        };
        return (
            <div className="canvas-container" ref="canvasDiv" style={style}>
                {null}
                {/*{ Upper: { user.upper_range } Lower: { user.lower_range } }*/}
            </div>
        );
    }

    canvasInit(width) {
        let canvasDiv = this.refs.canvasDiv;

        // clean up old stuff
        if (this.renderer) {
            this.renderer.destroy();
            this.stage.removeChild(this.graphics);
        }
        while (canvasDiv.lastChild) {
            canvasDiv.removeChild(canvasDiv.lastChild);
        }

        // make the new stuff
        this.renderer = PIXI.autoDetectRenderer(width, (width / 4));
        canvasDiv.appendChild(this.renderer.view);

        // create the root of the scene graph
        this.stage = new PIXI.Container(width, (width / 4));
        this.stage.width = 1366;
        this.stage.height = 768;

        this.graphics = new PIXI.Graphics();

        // set a fill and line style
        this.graphics.beginFill(0xFF3300);
        this.graphics.lineStyle(4, 0xffd900, 1);

        // draw a shape
        this.graphics.moveTo(50,50);
        this.graphics.lineTo(250, 50);
        this.graphics.lineTo(100, 100);
        this.graphics.lineTo(50, 50);
        this.graphics.endFill();

        // set a fill and a line style again and draw a rectangle
        this.graphics.lineStyle(2, 0x0000FF, 1);
        this.graphics.beginFill(0xFF700B, 1);
        this.graphics.drawRect(50, 250, 120, 120);

        // draw a rounded rectangle
        this.graphics.lineStyle(2, 0xFF00FF, 1);
        this.graphics.beginFill(0xFF00BB, 0.25);
        this.graphics.drawRoundedRect(150, 450, 300, 100, 15);
        this.graphics.endFill();

        // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        this.graphics.lineStyle(0);
        this.graphics.beginFill(0xFFFF0B, 0.5);
        this.graphics.drawCircle(470, 90,60);
        this.graphics.endFill();


        this.stage.addChild(this.graphics);

        //start animating
        this.animate();
    }


    /**
     * Animation loop for updating Pixi Canvas
     **/
    animate() {
        // render the stage container
        this.renderer.render(this.stage);
        this.frame = requestAnimationFrame(this.animate);
    }


}

Canvas.propTypes = {
    user: PropTypes.object.isRequired,
    currentLesson: PropTypes.object.isRequired,
    gridSize: PropTypes.string.isRequired,
};
