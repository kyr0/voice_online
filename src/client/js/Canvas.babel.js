import {
    CanvasRenderer,
    autoDetectRenderer,
    Container,
    Sprite,
    Graphics,
    Circle,
    Text,
    Point,
} from '../../dependencies/pixi.min.js';


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

    animationLoop() {
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
        const now = Date.now();
        this.lastPctComplete = this.pctComplete;

        this.player.checkStatus(now);

        this.pctComplete = (now - this.startTime) / this.durationInMilliseconds;
        this.setContainerRender.x = 0 - this.performanceWidth * this.pctComplete;
        this.performanceContainer.x = 0 - this.performanceWidth * this.pctComplete;
        this.drawPerformance();
    }

    drawPerformance() {
        this.previousY = this.pitchContainer.y;
        this.previousYRatio = this.yRatio;

        if (this.yRatio !== this.player.pitchYAxisRatio) {
            this.yRatio = this.player.pitchYAxisRatio;
            if (this.yRatio) {
                this.pitchContainer.y = this.noteHeight * this.yRatio + this.padding - (this.noteHeight / 2);
                this.pitchContainer.visible = true;
            } else {
                this.pitchContainer.visible = false;
            }
        }

        if (this.isFirstAudioEvent) {
            this.performanceGraphics.moveTo(this.currentTimeX, this.previousY);
            this.performanceGraphicsTip.moveTo(this.currentTimeX, this.previousY);
            this.isFirstAudioEvent = false;
            this.bezierCount = 0;
        }

        if (this.yRatio) {
            if (this.lastPctComplete <= this.pctComplete) {
                // To avoid drawing blank space when sound has been recorded at the start
                if (!this.previousYRatio) {
                    this.previousY = this.pitchContainer.y;
                    this.performanceGraphics.moveTo(this.currentTimeX + this.performanceWidth * this.lastPctComplete, this.previousY);
                    this.performanceGraphicsTip.moveTo(this.currentTimeX + this.performanceWidth * this.lastPctComplete, this.previousY);
                    // console.log('MOVE TIP & MAIN: ' + (this.currentTimeX + this.performanceWidth * this.lastPctComplete) + ', ' + this.previousY);
                    // console.log('Curnt Time X: ' + this.currentTimeX + ' - Perf Width: ' + this.performanceWidth+ ' - Last %: ' + this.lastPctComplete + ' - First: ' + this.isFirstAudioEvent);
                    this.bezierCount = 0;
                    // console.log('RESET');
                    // console.log('Y Ratio:' + this.yRatio + ' - Previous Y Ratio: ' + this.previousYRatio + ' - Last %: ' + this.lastPctComplete + ' - % Comp: ' + this.pctComplete);
                }

                if (this.previousY) {
                    this.points[this.bezierCount] = [this.currentTimeX + this.performanceWidth * this.pctComplete, this.pitchContainer.y];
                    this.bezierCount++;
                    if (this.bezierCount < 3) {
                        // console.log('LINE TO, TIP ONLY');
                        // console.log(this.points[this.bezierCount - 1]);
                        this.performanceGraphicsTip.lineTo(this.points[this.bezierCount - 1]);
                    } else {
                        // console.log('BEZIER DRAW, TIP & MAIN');
                        // console.log(this.points);
                        // the bezier coords are full, so we draw it permanently to the performanceGraphics
                        this.bezierCount = 0;
                        this.performanceGraphics.bezierCurveTo(
                            this.points[0][0], this.points[0][1],
                            this.points[1][0], this.points[1][1],
                            this.points[2][0], this.points[2][1]
                        );
                        this.performanceGraphicsTip.clear();
                        this.performanceGraphicsTip.moveTo(this.points[2][0], this.points[2][1]);
                    }
                }
            }
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
        });

        this.player.on('endSet', () => {
            this.curSetIdx++;
            if (this.player.sets.length > this.curSetIdx) {
                this.updateSetLabel();
                this.updatePerformanceSetGraphic();
            }
        });


        this.player.on('endExercise', aggNoteScores => {
            // submitScores(aggNoteScores);
        });

        this.player.on('startExercise', () => {
            this.curSetIdx = 0;
            this.clearAnyPerformances();
            this.prepareForPerformance();
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
            this.durationInMilliseconds = this.set.durationInMilliseconds;
            this.noteHeight = this.performanceHeight * (1 / this.yAnchorCount);
            this.padding = (this.yAnchorCount - this.set.getLessonRange() - 1) * this.noteHeight / 2;
            this.renderSetContainer();
            this.renderAllLabels();

            // pitch indicator
            this.pitchContainer = new Container();
            this.pitchGraphics = new Graphics();
            this.pitchContainer.addChild(this.pitchGraphics);
            this.pitchGraphics.beginFill(0xFFA500);
            this.pitchGraphics.drawCircle(this.currentTimeX, 0, 4);
            this.pitchContainer.visible = false;
            this.pitchGraphics.endFill();
            this.stage.addChild(this.pitchContainer);

            // this.renderer = this.autoDetectRenderer;
        }
    }


    prepareForPerformance() {
        this.performances = [];
        this.isFirstAudioEvent = true;
        this.points = [[this.currentTimeX, 0], [this.currentTimeX, 0], [this.currentTimeX, 0]];  // prepare the blank points for bezier curve
        this.performanceContainer = new Container();
        this.bezierCount = 0;

        // create a graphics object for each set in the exercise
        for (let setIdx = 0; setIdx < this.player.sets.length; setIdx++) {
            this.performances.push(new Graphics());
            this.performanceContainer.addChild(this.performances[setIdx]);
            this.performances[setIdx].visible = false;
            this.performances[setIdx].lineStyle(4, 0xFFA500);
        }
        // Activate the 1st set
        this.performanceGraphics = this.performances[0];
        this.performanceGraphics.visible = true;

        this.performanceGraphicsTip = new Graphics();  // the tip of the performance before bezier curve drawn
        this.performanceContainer.addChild(this.performanceGraphicsTip);

        this.stage.addChild(this.performanceContainer);

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


    _getLabelTextureForSet(set) {
        const labelContainer = new Container();
        const labelGraphics = new Graphics();

        labelContainer.addChild(labelGraphics);
        labelGraphics.beginFill(0xFFFFFF);

        for (const label in set.chart) {
            if (set.chart.hasOwnProperty(label)) {
                // Use 'fontFamily','fontSize',fontStyle','fontVariant' and 'fontWeight' properties
                let text = new Text(label, {
                    fontSize: this.noteHeight - (this.noteHeight * 0.2),
                    fontWeight: 100,
                    fontFamily: 'Helvetica Neue',
                    fill: 'white',
                    letterSpacing: 2,
                });
                text.position.set(5, (set.chart[label] * this.noteHeight) + this.padding);
                labelContainer.addChild(text);
            }
        }

        labelGraphics.endFill();

        const labelContainerTexture = this.renderer.generateTexture(labelContainer);
        labelContainer.destroy({ children: true });
        let labelContainerRender = new Sprite(labelContainerTexture);
        labelContainerRender.cacheAsBitmap = true;
        labelContainerRender.visible = false;
        this.stage.addChild(labelContainerRender);
        return labelContainerRender;
    }

    renderAllLabels() {
        this.labels = [];
        for (let setIdx = 0; setIdx < this.player.sets.length; setIdx++) {
            this.labels.push(this._getLabelTextureForSet(this.player.sets[setIdx]));
        }
        this.labels[0].visible = true;
    }

    updateSetLabel() {
        this.labels[this.curSetIdx - 1].visible = false;
        this.labels[this.curSetIdx].visible = true;
    }

    updatePerformanceSetGraphic() {
        this.performanceGraphics.visible = false;
        this.performanceGraphics = this.performances[this.curSetIdx];
        this.performanceGraphics.visible = true;
        this.performanceGraphics.moveTo(this.currentTimeX, this.previousY);
        this.performanceGraphicsTip.moveTo(this.currentTimeX, this.previousY);
        console.log('MOVE TIP & MAIN: ' + this.currentTimeX + ', ' + this.previousY);
        this.bezierCount = 0;
    }

    clearAnyPerformances() {
        if (this.performances) {
            this.performanceContainer.destroy();
            this.performances = null;
        }
    }

    resetConnections() {
        // clean up old renderer, stage, and canvases
        if (this.renderer) {
            this.renderer = null;
            this.autoDetectRenderer.destroy();
            this.canvasRenderer.destroy();
            this.stage.destroy({ children: true });
        }

        while (this.canvasDiv.lastChild) {
            this.canvasDiv.removeChild(this.canvasDiv.lastChild);
        }

        // make the new stuff
        this.canvasRenderer = new CanvasRenderer(this.width, this.height,
            {
                transparent: false,
                antialias: true,
            }
        );
        this.autoDetectRenderer = autoDetectRenderer(this.width, this.height,
            {
                transparent: false,
                antialias: true,
            }
        );
        this.renderer = this.canvasRenderer;
        // this.renderer.view.style.border = '1px dashed white';
        this.canvasDiv.appendChild(this.canvasRenderer.view);

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
