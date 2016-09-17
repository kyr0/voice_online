import { CanvasRenderer, Container, Sprite, Graphics, Text } from '../../dependencies/pixi.min.js';


export default class Canvas {
    constructor(canvasDiv) {
        this.animationLoop = this.animationLoop.bind(this);
        this.canvasDiv = canvasDiv;
        this.state = this.stopped;
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
        this.state();
        this.frame = requestAnimationFrame(this.animationLoop);
    }

    start() {
        this.state = this.running;
    }

    stop() {
        this.state = this.stopped;
    }

    running() {
        let pctComplete = this.player.getPctComplete();
        this.setRender.x = 0 - this.performanceWidth * pctComplete;
    }

    stopped() {}

    resetPlayerListenersInCanvas() {
        this.player.on('stopExercise', () => {
            console.log('stopExercise');
            this.stop();
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
            this.start();
        });
    }

    // DRAWING FUNCTIONS

    drawNotes() {
        this.notesContainer = new Container();
        let notesGraphics = new Graphics();
        this.notesContainer.addChild(notesGraphics);

        const measureWidth = this.width / this.xAnchorDivisor;
        const noteHeight = this.performanceHeight * (1 / this.yAnchorCount);
        const padding = (this.yAnchorCount - this.set.getLessonRange() - 1) * noteHeight / 2;
        const radius = this.performanceHeight * (1 / this.yAnchorCount) / 2;

        let consumedX = this.currentTimeX;

        this.set.noteList.forEach(note => {
            let noteWidth = note.durationInMeasures * measureWidth;
            if (note.name !== '-') {
                // TODO restrict notes to be no smaller than 1/16 and lessons to be no greater than 2 octaves
                notesGraphics.beginFill(0xFFFFFF, 1);
                notesGraphics.drawRoundedRect(consumedX, (this.set.chart[note.name] * noteHeight) + padding, noteWidth, noteHeight, radius);
                notesGraphics.endFill();
            } else {
                notesGraphics.beginFill(0xFFFFFF, 0);
                notesGraphics.drawRoundedRect(consumedX, padding, noteWidth, noteHeight, radius);
                notesGraphics.endFill();
            }
            consumedX += noteWidth;
        });

        this.performanceWidth = this.notesContainer.width;
        this.setContainer.addChild(this.notesContainer);
    }

    drawCaptions() {
        const measureWidth = this.width / this.xAnchorDivisor;
        const noteHeight = this.performanceHeight * (1 / this.yAnchorCount);

        let captionsGraphics = new Graphics();
        this.setContainer.addChild(captionsGraphics);

        let consumedX = this.currentTimeX;

        captionsGraphics.beginFill(0xFFFFFF);

        this.set.captionList.forEach(caption => {
            let captionWidth = caption.durationInMeasures * measureWidth;
            if (caption.text) {
                let text = new Text(caption.text, { fontSize: noteHeight, fontWeight: 100, fontFamily: 'Helvetica Neue', fill: 'white' });
                text.position.set(consumedX, this.height - (this.captionHeight * 0.1));
                text.anchor.set(0, 1);
                this.setContainer.addChild(text);
            }
            consumedX += captionWidth;
        });

        captionsGraphics.endFill();
    }

    createLabels() {
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
            this.createLabels();
            const texture = this.renderer.generateTexture(this.setContainer);
            this.setRender = new Sprite(texture);
            this.stage.addChild(this.setRender);
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
            this.stage.destroy({ children: true });
        }
        while (this.canvasDiv.lastChild) {
            this.canvasDiv.removeChild(this.canvasDiv.lastChild);
        }
    }

    create() {
        // make the new stuff
        this.renderer = new CanvasRenderer(this.width, this.height,
            {
                transparent: true,
                antialias: true,
            }
        );
        // this.renderer.view.style.border = '1px dashed white';
        this.canvasDiv.appendChild(this.renderer.view);

        // create the root of the scene graph
        this.stage = new Container(this.width, this.height);
        this.setContainer = new Container();
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
