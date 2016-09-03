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
        let height = width / 2.2;

        // clean up old stuff
        if (this.renderer) {
            this.renderer.destroy();
            this.stage.removeChild(this.graphics);
        }
        while (canvasDiv.lastChild) {
            canvasDiv.removeChild(canvasDiv.lastChild);
        }

        // make the new stuff
        this.renderer = PIXI.autoDetectRenderer(width, height,
            {
                transparent: true,
                clearBeforeRender: false,
                antialias: true,
            }
        );
        this.renderer.view.style.border = '1px dashed black';
        canvasDiv.appendChild(this.renderer.view);

        // create the root of the scene graph
        this.stage = new PIXI.Container(width, height);
        this.stage.width = width;
        this.stage.height = height;

        this.graphics = new PIXI.Graphics();


        // draw a rounded rectangle
        this.graphics.lineStyle(0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRoundedRect(50, 50, (width / 10), (height * (1 / 24)), ((height * (1 / 24) / 2)));
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
