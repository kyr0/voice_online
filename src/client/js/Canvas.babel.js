import { autoDetectRenderer, Container, Graphics, Text } from '../../dependencies/pixi.min.js';


import Lesson  from './Lesson';
import User from './User';
import Player from './Player';


export default class Canvas {
    constructor(canvasDiv) {
        this.animationLoop = this.animationLoop.bind(this);
        this.canvasDiv = canvasDiv;
    }

    initialize() {
        if (this.user && this.lesson) {
            this.player = new Player(this.user, this.lesson);
            this.set = this.player.getCurrentSet();
        }

        this.resetConnections();
        this.drawInitialCanvas();
        this.animationLoop();
    }

    animationLoop() {
        // render the stage container
        this.renderer.render(this.stage);
        this.frame = requestAnimationFrame(this.animationLoop);
    }

    start() {}

    end() {}


    // DRAWING FUNCTIONS
    drawNotes() {
        // TODO restrict notes to be no smaller than 1/16 and lessons to be no greater than 2 octaves
        const duration = this.set.durationInMeasures;
        const chart = this.set.chart;

        console.log(chart);

        const measureWidth = this.width / this.xAnchorDivisor;
        const noteHeight = this.height * (1 / this.yAnchorCount);
        const radius = this.height * (1 / this.yAnchorCount) / 2;

        let consumedX = this.currentTimeX;
        this.graphics.beginFill(0x000000);
        this.set.noteList.forEach(note => {
            let noteWidth = note.durationInMeasures * measureWidth;
            this.graphics.drawRoundedRect(consumedX, (chart[note.name] * noteHeight), noteWidth, noteHeight, radius);
            consumedX += noteWidth;
        });

        this.graphics.endFill();
    }

    // helper functions
    drawInitialCanvas() {
        this.graphics = new Graphics();
        this.stage.addChild(this.graphics);

        this.graphics.lineStyle(1, 0xFFFFFF);
        this.graphics.moveTo(this.currentTimeX, 0);
        this.graphics.lineTo(this.currentTimeX, this.height);
        this.graphics.lineStyle(0);

        if (this.set) {
            this.drawNotes();
        }

        //// some text
        // let labels = new Text(
        //     'A A# B C C# D D# E',
        //     { font: '32px sans-serif', fill: 'white' }
        // );
        // labels.style = { wordWrap: true, wordWrapWidth: 5 };
        // labels.position.set(10, 10);
        // this.stage.addChild(labels);
    }

    resetConnections() {
        this.destroy();
        this.create();
    }

    destroy() {
        // clean up old renderer, stage, and canvases
        if (this.renderer) {
            this.renderer.destroy();
            this.stage.removeChild(this.graphics);
        }
        while (this.canvasDiv.lastChild) {
            this.canvasDiv.removeChild(this.canvasDiv.lastChild);
        }
    }

    create() {
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
    }

    setWidth(width) {
        this.width = width;
        this.heightDivisor = 2.2;
        this.yAnchorCount = 24;
        this.xAnchorDivisor = 4;  // x anchors (aka visible measures on screen)

        this.height = this.width / this.heightDivisor;
        this.currentTimeX = this.width / 2;

        this.initialize();
    }

    setUser(user) {
        this.user = new User(user.lower_range, user.upper_range);
        this.initialize();
    }

    setLesson(lesson) {
        this.lesson = new Lesson({
            title: lesson.title,
            bpm: lesson.bpm,
            noteList: lesson.notes,
            captionList: lesson.captions,
        });
        this.initialize();
    }


}
