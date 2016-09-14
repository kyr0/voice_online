import { autoDetectRenderer, Container, Graphics, Text } from '../../dependencies/pixi.min.js';


export default class Canvas {
    constructor(canvasDiv) {
        this.animationLoop = this.animationLoop.bind(this);
        this.canvasDiv = canvasDiv;
    }

    initialize() {
        if (this.player) {
            this.set = this.player.getCurrentSet();
            this.resetPlayerListenersInCanvas();
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

    resetPlayerListenersInCanvas() {
        this.player.on('stopExercise', () => {
            console.log('stopExercise');
        });

        this.player.on('endSet', () => {
            console.log('endSet');
            // updateSet();
        });

        this.player.on('endExercise', aggNoteScores => {
            console.log('endExercise');
            // submitScores(aggNoteScores);
        });

        this.player.on('startExercise', () => {
            console.log('startExercise');
        });
    }

    // DRAWING FUNCTIONS

    drawNotes() {
        const measureWidth = this.width / this.xAnchorDivisor;
        const noteHeight = this.performanceHeight * (1 / this.yAnchorCount);
        const padding = (this.yAnchorCount - this.set.getLessonRange() - 1) * noteHeight / 2;
        const radius = this.performanceHeight * (1 / this.yAnchorCount) / 2;

        let consumedX = this.currentTimeX;

        this.graphics.beginFill(0xFFFFFF);
        this.set.noteList.forEach(note => {
            let noteWidth = note.durationInMeasures * measureWidth;
            if (note.name !== '-') {
                // TODO restrict notes to be no smaller than 1/16 and lessons to be no greater than 2 octaves
                this.graphics.drawRoundedRect(consumedX, (this.set.chart[note.name] * noteHeight) + padding, noteWidth, noteHeight, radius);
            }
            consumedX += noteWidth;
        });

        this.graphics.endFill();
    }

    drawCaptions() {
        const measureWidth = this.width / this.xAnchorDivisor;
        const noteHeight = this.performanceHeight * (1 / this.yAnchorCount);

        let consumedX = this.currentTimeX;

        this.graphics.beginFill(0xFFFFFF);
        this.set.captionList.forEach(caption => {
            let captionWidth = caption.durationInMeasures * measureWidth;
            if (caption.text) {
                let text = new Text(caption.text, { fontSize: noteHeight, fontWeight: 100, fontFamily: 'Helvetica Neue', fill: 'white' });
                text.position.set(consumedX, this.height - (this.captionHeight * 0.1));
                text.anchor.set(0, 1);
                this.stage.addChild(text);
            }
            consumedX += captionWidth;
        });

        this.graphics.endFill();
    }

    drawLabels() {
        const noteHeight = this.performanceHeight * (1 / this.yAnchorCount);
        const padding = (this.yAnchorCount - this.set.getLessonRange() - 1) * noteHeight / 2;

        for (const label in this.set.chart) {
            if (this.set.chart.hasOwnProperty(label)) {
                // Use 'fontFamily','fontSize',fontStyle','fontVariant' and 'fontWeight' properties
                let text = new Text(label, { fontSize: noteHeight - (noteHeight * 0.2), fontWeight: 100, fontFamily: 'Helvetica Neue', fill: 'white' });
                text.position.set(5, (this.set.chart[label] * noteHeight) + padding);
                this.stage.addChild(text);
            }
        }
    }

    // helper functions
    drawInitialCanvas() {
        this.graphics = new Graphics();
        this.stage.addChild(this.graphics);

        // const duration = this.set.durationInMeasures;

        // center line
        this.graphics.lineStyle(2, 0xFFFFFF);
        this.graphics.moveTo(this.currentTimeX, 0);
        this.graphics.lineTo(this.currentTimeX, this.performanceHeight);
        this.graphics.lineStyle(0);

        if (this.set) {
            this.drawNotes();
            this.drawCaptions();
            this.drawLabels();
        }
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
        // this.renderer.view.style.border = '1px dashed white';
        this.canvasDiv.appendChild(this.renderer.view);

        // create the root of the scene graph
        this.stage = new Container(this.width, this.height);
    }

    setWidth(width) {
        this.width = width;
        this.heightDivisor = 2.2;
        this.yAnchorCount = 20;
        this.xAnchorDivisor = 3;  // x anchors (aka visible measures on screen)

        this.height = this.width / this.heightDivisor;
        this.captionHeight = this.height * 0.1;
        this.performanceHeight = this.height - this.captionHeight;
        this.currentTimeX = this.width / 2;

        this.initialize();
    }

    setPlayer(player) {
        this.player = player;
        this.initialize();
    }
}
