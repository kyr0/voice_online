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
            this.setPlayerListenersInCanvas();
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
        this.startTime = this.player.startTime;
        this.state = this.running;
    }

    stop() {
        this.state = this.stopped;
    }

    running() {
        var now = Date.now();
        this.player.checkStatus(now);
        this.pctComplete = (now - this.startTime) / this.durationInMilliseconds;
        this.setContainerRender.x = 0 - this.performanceWidth * this.pctComplete;
        this.yRatio = this.player.pitchYAxisRatio;
        if (this.yRatio) {
            this.pitchContainer.y = this.noteHeight * this.yRatio + this.padding + (this.noteHeight / 2);
            this.pitchContainer.visible = true;
        } else {
            this.pitchContainer.visible = false;
        }
    }

    stopped() {}

    setPlayerListenersInCanvas() {
        this.player.on('stopExercise', () => {
            this.stop();
        });

        this.player.on('startSet', () => {
            this.set = this.player.getCurrentSet();
            this.startTime = this.player.startTime;
            this.drawLabels();
        });

        this.player.on('endExercise', aggNoteScores => {
            // submitScores(aggNoteScores);
        });

        this.player.on('startExercise', () => {
            this.start();
        });
    }


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


    renderSetContainer() {
        this.drawNotes();
        this.drawCaptions();
        const setContainerTexture = this.renderer.generateTexture(this.setContainer);
        this.setContainer.destroy({ children: true });
        this.setContainerRender = new Sprite(setContainerTexture);
        this.setContainerRender.cacheAsBitmap = true;
        this.stage.addChild(this.setContainerRender);
    }


    drawLabels() {
        if (this.labelContainerRender) {
            this.stage.removeChild(this.labelContainerRender);
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

        const labelContainerTexture = this.renderer.generateTexture(this.labelContainer);
        this.labelContainer.destroy({ children: true });
        this.labelContainerRender = new Sprite(labelContainerTexture);
        this.labelContainerRender.cacheAsBitmap = true;
        this.stage.addChild(this.labelContainerRender);
    }


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
            this.renderSetContainer();
            this.drawLabels();
        }
    }

    resetConnections() {
        this._destroy();
        this._create();
    }

    _destroy() {
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

    _create() {
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
