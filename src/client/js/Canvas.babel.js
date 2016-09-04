import { autoDetectRenderer, Container, Graphics, Text } from '../../dependencies/pixi.min.js';


import Lesson  from './Lesson';
import User from './User';
import Player from './Player';


export default class Canvas {
    constructor(canvasDiv) {
        this.animationLoop = this.animationLoop.bind(this);
        this.canvasDiv = canvasDiv;
    }

    initialize(width) {
        this.width = width;

        const heightDivisor = 2.2;
        const yAnchorCount = 24;
        const xAnchorDivisor = 36;  // x anchors (aka measures) are not centered they start at X

        this.height = this.width / heightDivisor;
        this.currentTimeX = this.width / 2;
        this.yUnitSize = this.height / (yAnchorCount + 1); // y anchors must be centered, so we need to add 1
        this.xUnitSize = this.width / xAnchorDivisor;

        this.resetConnections();

        // draw a rounded rectangle
        this.graphics = new Graphics();
        this.graphics.lineStyle(0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRoundedRect(50, 50, (this.width / xAnchorDivisor), (this.height * (1 / yAnchorCount)), ((this.height * (1 / yAnchorCount) / 2)));
        this.graphics.endFill();
        this.stage.addChild(this.graphics);

        // some text
        let labels = new Text(
            'A A# B C C# D D# E',
            { font: '32px sans-serif', fill: 'white' }
        );
        labels.style = { wordWrap: true, wordWrapWidth: 5 };
        labels.position.set(10, 10);
        this.stage.addChild(labels);

        //start animating
        this.animationLoop();
    }

    animationLoop() {
        // render the stage container
        this.renderer.render(this.stage);
        this.frame = requestAnimationFrame(this.animationLoop);
    }

    start() {}

    end() {}

    // helper functions
    setUser(user) {
        this.user = new User(user.lower_range, user.upper_range);
    }

    setLesson(lesson) {
        this.lesson = new Lesson({
            title: lesson.title,
            bpm: lesson.bpm,
            noteList: lesson.notes,
            captionList: lesson.captions,
        });
    }

    resetConnections() {
        // clean up old stuff
        if (this.renderer) {
            this.renderer.destroy();
            this.stage.removeChild(this.graphics);
        }
        while (this.canvasDiv.lastChild) {
            this.canvasDiv.removeChild(this.canvasDiv.lastChild);
        }

        // make the new stuff
        this.renderer = autoDetectRenderer(this.width, this.height,
            {
                transparent: true,
                clearBeforeRender: false,
                antialias: true,
            }
        );
        this.renderer.view.style.border = '1px dashed black';
        this.canvasDiv.appendChild(this.renderer.view);

        // create the root of the scene graph
        this.stage = new Container(this.width, this.height);
        this.stage.width = this.width;
        this.stage.height = this.height;

    }
}
