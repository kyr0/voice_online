import React, { Component, PropTypes } from 'react';
import PIXI from '../../../dependencies/pixi.min.js';


export default class Canvas extends Component {

    constructor( props ) {
        super(props);

        //bind our animate function
        this.animate = this.animate.bind(this);
        //bind our zoom function
        this.updateZoomLevel = this.updateZoomLevel.bind(this);
    }

    /**
     * In this case, componentDidMount is used to grab the canvas container ref, and
     * and hook up the PixiJS renderer
     **/
    componentDidMount() {
        //Setup PIXI Canvas in componentDidMount
        this.renderer = PIXI.autoDetectRenderer(800, 400);
        this.refs.gameCanvas.appendChild(this.renderer.view);

        // create the root of the scene graph
        this.stage = new PIXI.Container();
        this.stage.width = 1366;
        this.stage.height = 768;

        var graphics = new PIXI.Graphics();

        // set a fill and line style
        graphics.beginFill(0xFF3300);
        graphics.lineStyle(4, 0xffd900, 1);

        // draw a shape
        graphics.moveTo(50,50);
        graphics.lineTo(250, 50);
        graphics.lineTo(100, 100);
        graphics.lineTo(50, 50);
        graphics.endFill();

        // set a fill and a line style again and draw a rectangle
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(50, 250, 120, 120);

        // draw a rounded rectangle
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0xFF00BB, 0.25);
        graphics.drawRoundedRect(150, 450, 300, 100, 15);
        graphics.endFill();

        // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        graphics.lineStyle(0);
        graphics.beginFill(0xFFFF0B, 0.5);
        graphics.drawCircle(470, 90,60);
        graphics.endFill();


        this.stage.addChild(graphics);

        //start the game
        this.animate();
    }
    /**
     * shouldComponentUpdate is used to check our new props against the current
     * and only update if needed
     **/
    shouldComponentUpdate(nextProps, nextState) {
        //this is easy with 1 prop, using Immutable helpers make
        //this easier to scale

        return nextProps.zoomLevel !== this.props.zoomLevel;
    }
    /**
     * When we get new props, run the appropriate imperative functions
     **/
    componentWillReceiveProps(nextProps) {
        this.updateZoomLevel(nextProps);
    }

    /**
     * Update the stage "zoom" level by setting the scale
     **/
    updateZoomLevel(props) {
        this.stage.scale.x = props.zoomLevel;
        this.stage.scale.y = props.zoomLevel;
    }

    /**
     * Animation loop for updating Pixi Canvas
     **/
    animate() {
        // render the stage container
        this.renderer.render(this.stage);
        this.frame = requestAnimationFrame(this.animate);
    }

    /**
     * Render our container that will store our PixiJS game canvas. Store the ref
     **/
    render() {
        return (
            <div className="game-canvas-container" ref="gameCanvas">
            </div>
        );
    }
}

Canvas.propTypes = { zoomLevel: React.PropTypes.number.isRequired };