import { CanvasRenderer, Container, Sprite, Graphics, Circle, Text } from '../../dependencies/pixi.min.js';


export default class Canvas {
    constructor(canvasDiv) {
        this.animationLoop = this.animationLoop.bind(this);
        this.canvasDiv = canvasDiv;
        this.state = this.stopped;
        this.pctComplete = 0;
        this.yRatio = null;
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

    animationLoop(elapsedTime) {
        // elapsed time starts at round 560ms, and increases from there
        this.renderer.render(this.stage);
        this.state();
        this.frame = requestAnimationFrame(this.animationLoop);
    }

    start() {
        this.startTime = Date.now();
        this.state = this.running;
    }

    stop() {
        this.state = this.stopped;
    }

    running() {
        this.pctComplete = (Date.now() - this.startTime) / this.durationInMilliseconds;
        this.setRender.x = 0 - this.performanceWidth * this.pctComplete;
        this.yRatio = this.player.pitchYAxisRatio;
        if (this.yRatio) {
            this.pitchContainer.y = this.noteHeight * this.yRatio + this.padding + (this.noteHeight / 2);
            this.pitchContainer.visible = true;
        } else {
            this.pitchContainer.visible = false;
        }
    }

    stopped() {}

    resetPlayerListenersInCanvas() {
        this.player.on('stopExercise', () => {
            console.log('stopExercise');
            this.stop();
        });

        this.player.on('endSet', () => {
            console.log('endSet');
            this.set = this.player.getCurrentSet();
            this.startTime = Date.now();
            this.drawLabels();
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
        const radius = this.performanceHeight * (1 / this.yAnchorCount) / 2;

        let consumedX = this.currentTimeX;

        this.set.noteList.forEach(note => {
            let noteWidth = note.durationInMeasures * measureWidth;
            if (note.name !== '-') {
                // TODO restrict notes to be no smaller than 1/16 and lessons to be no greater than 2 octaves
                notesGraphics.beginFill(0xFFFFFF, 1);
                notesGraphics.drawRoundedRect(consumedX, (this.set.chart[note.name] * this.noteHeight) + this.padding, noteWidth, this.noteHeight, radius);
                notesGraphics.endFill();
            } else {
                notesGraphics.beginFill(0xFFFFFF, 0);
                notesGraphics.drawRoundedRect(consumedX, this.padding, noteWidth, this.noteHeight, radius);
                notesGraphics.endFill();
            }
            consumedX += noteWidth;
        });

        this.performanceWidth = this.notesContainer.width;
        this.setContainer.addChild(this.notesContainer);
    }

    drawCaptions() {
        const measureWidth = this.width / this.xAnchorDivisor;

        let captionsGraphics = new Graphics();
        this.setContainer.addChild(captionsGraphics);

        let consumedX = this.currentTimeX;

        captionsGraphics.beginFill(0xFFFFFF);

        this.set.captionList.forEach(caption => {
            let captionWidth = caption.durationInMeasures * measureWidth;
            if (caption.text) {
                let text = new Text(caption.text, {
                    fontSize: this.noteHeight,
                    fontWeight: 100,
                    fontFamily: 'Helvetica Neue',
                    fill: 'white',
                    letterSpacing: 2,
                });
                text.position.set(consumedX, this.height - (this.captionHeight * 0.1));
                text.anchor.set(0, 1);
                this.setContainer.addChild(text);
            }
            consumedX += captionWidth;
        });

        captionsGraphics.endFill();
    }

    drawLabels() {
        if (this.labelContainer) {
            this.stage.removeChild(this.labelContainer);
            this.labelContainer.destroy({ children: true });
        }
        this.labelContainer = new Container();

        this.labelGraphics = new Graphics();
        this.labelContainer.addChild(this.labelGraphics);

        this.labelGraphics.beginFill(0xFFFFFF);

        for (const label in this.set.chart) {
            if (this.set.chart.hasOwnProperty(label)) {
                // Use 'fontFamily','fontSize',fontStyle','fontVariant' and 'fontWeight' properties
                let text = new Text(label, {
                    fontSize: this.noteHeight - (this.noteHeight * 0.2),
                    fontWeight: 100,
                    fontFamily: 'Helvetica Neue',
                    fill: 'white',
                    letterSpacing: 2,
                });
                text.position.set(5, (this.set.chart[label] * this.noteHeight) + this.padding);
                this.labelContainer.addChild(text);
            }
        }

        this.labelGraphics.endFill();
        this.stage.addChild(this.labelContainer);
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

        // pitch indicator
        this.pitchContainer = new Container();
        this.pitchGraphics = new Graphics();
        this.pitchContainer.addChild(this.pitchGraphics);
        this.pitchGraphics.beginFill(0xFFFFFF);
        this.pitchGraphics.drawCircle(this.currentTimeX, 0, 4);
        this.pitchContainer.visible = false;
        this.pitchGraphics.endFill();
        this.stage.addChild(this.pitchContainer);

        if (this.set) {
            this.durationInMilliseconds = this.set.durationInMilliseconds;
            this.noteHeight = this.performanceHeight * (1 / this.yAnchorCount);
            this.padding = (this.yAnchorCount - this.set.getLessonRange() - 1) * this.noteHeight / 2;
            this.drawNotes();
            this.drawCaptions();
            this.drawLabels();
            const texture = this.renderer.generateTexture(this.setContainer);
            this.setRender = new Sprite(texture);
            this.setRender.cacheAsBitmap = true;
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
            this.labelContainer = null;
            this.setContainer = null;
        }
        while (this.canvasDiv.lastChild) {
            this.canvasDiv.removeChild(this.canvasDiv.lastChild);
        }
    }

    create() {
        // make the new stuff
        this.renderer = new CanvasRenderer(this.width, this.height,
            {
                transparent: false,
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
