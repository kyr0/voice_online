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
        // this.bezierTimeInterval = 33.33;  // milliseconds
        this.bezierTimeInterval = 33.33;  // milliseconds
        this.performanceLineWidth = 3;
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
        this.now = Date.now();
        this.previousX = this.startTimeX + this.performanceWidth * this.lastPctComplete;
        this.lastPctComplete = this.pctComplete;

        this.player.checkStatus(this.now);

        this.pctComplete = (this.now - this.startTime) / this.durationInMilliseconds;
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
            this.doMultiGraphicMove(this.startTimeX, this.previousY);
            this.isFirstAudioEvent = false;
            this.performanceDirection = null;
        }

        if (this.yRatio) {
            if (this.lastPctComplete <= this.pctComplete) {
                // To avoid drawing blank space when sound has been recorded at the start
                if (!this.previousYRatio) {
                    this.previousY = this.pitchContainer.y;
                    this.doMultiGraphicMove(this.startTimeX + this.performanceWidth * this.lastPctComplete, this.previousY);
                    this.performanceDirection = null;
                }

                if (this.previousY) {
                    this.checkForBezierPoint(this.startTimeX + this.performanceWidth * this.pctComplete, this.pitchContainer.y);
                    if (this.bezierPointCount < 2) {
                        this.performanceGraphicsTip.lineTo(this.startTimeX + this.performanceWidth * this.pctComplete, this.pitchContainer.y);
                    } else {
                        this.setControlPoints(this.currentX, this.currentY, this.points[0][0], this.points[0][1], this.points[1][0], this.points[1][1]);
                        // The bezier coords are full, so we draw it permanently to the performanceGraphics
                        this.performanceGraphics.bezierCurveTo(
                            this.cp1x, this.cp1y,
                            this.cp2x, this.cp2y,
                            this.points[0][0], this.points[0][1]
                        );
                        // Smooth out the bezier curve 'joints'
                        this.performanceGraphics.beginFill(0xFFA500);
                        this.performanceGraphics.lineStyle(0);
                        this.performanceGraphics.drawCircle(this.points[0][0], this.points[0][1], this.performanceLineWidth / 2.2);
                        this.performanceGraphics.endFill(0xFFA500);
                        this.performanceGraphics.lineStyle(this.performanceLineWidth, 0xFFA500);

                        // Clear the old 'tip' which has been replaced by a bezier curve
                        this.performanceGraphicsTip.clear();
                        this.performanceGraphicsTip.lineStyle(this.performanceLineWidth, 0xFFA500);

                        // After drawing the 'joint' circle it is necessary to move the main graphics
                        // back in place with the tip
                        this.doMultiGraphicMove(this.points[0][0], this.points[0][1]);
                    }
                }
            }
        }
    }

    setControlPoints(x0, y0, x1, y1, x2, y2){
        // thanks to Rob Spencer - http://scaledinnovation.com/analytics/splines/aboutSplines.html
        const t = 0;
        const d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        const d12= Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const fa = t * d01 / (d01 + d12);     // scaling factor for triangle Ta
        const fb = t - fa;                    // ditto for Tb, could be 't * d12 / (d01 + d12)'
        this.cp1x = x1 - fa * (x2 - x0);      // x2 - x0 is the width of triangle T
        this.cp1y = y1 - fa * (y2 - y0);      // y2 - y0 is the height of T
        this.cp2x = x1 + fb * (x2 - x0);
        this.cp2y = y1 + fb * (y2 - y0);
    }

    doMultiGraphicMove(x, y, noMoveMain) {
        if (!noMoveMain) {
            this.performanceGraphics.moveTo(x, y);
        }
        this.performanceGraphicsTip.moveTo(x, y);
        this.currentX = x;
        this.currentY = y;
        this.bezierPointCount = 0;
        this.lastBezierTime = this.now;
    }


    checkForBezierPoint(x, y) {

        // default
        // this.points[this.bezierCount] = [x, y];
        // this.bezierCount++;

        this.previousDirection = this.performanceDirection;

        // determine the current direction of the audio
        if (y - this.previousY > 0) {
            this.performanceDirection = 'up';
        } else if (y - this.previousY < 0) {
            this.performanceDirection = 'down';
        }

        // mark a bezier point if direction has changed or if it's past time for a new one
        if (this.previousDirection !== this.performanceDirection ||
            this.bezierTimeInterval <= this.now - this.lastBezierTime) {
            this.points[this.bezierPointCount][0] = x;
            this.points[this.bezierPointCount][1] = y;
            this.bezierPointCount++;
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

        let consumedX = this.startTimeX;

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

        let consumedX = this.startTimeX;

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
        this.graphics.moveTo(this.startTimeX, 0);
        this.graphics.lineTo(this.startTimeX, this.performanceHeight);
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
            this.pitchGraphics.drawCircle(this.startTimeX, 0, 4);
            this.pitchContainer.visible = false;
            this.pitchGraphics.endFill();
            this.stage.addChild(this.pitchContainer);

            // this.renderer = this.autoDetectRenderer;
        }
    }


    prepareForPerformance() {
        this.performances = [];
        this.isFirstAudioEvent = true;
        this.points = [[0, 0], [0, 0]];  // prepare the blank points for bezier curve
        this.performanceContainer = new Container();
        this.bezierPointCount = 0;
        this.performanceDirection = null;

        // create a graphics object for each set in the exercise
        for (let setIdx = 0; setIdx < this.player.sets.length; setIdx++) {
            this.performances.push(new Graphics());
            this.performanceContainer.addChild(this.performances[setIdx]);
            this.performances[setIdx].visible = false;
            this.performances[setIdx].lineStyle(this.performanceLineWidth, 0xFFA500);
        }
        // Activate the 1st set
        this.performanceGraphics = this.performances[0];
        this.performanceGraphics.visible = true;

        this.performanceGraphicsTip = new Graphics();  // the tip of the performance before bezier curve drawn
        this.performanceContainer.addChild(this.performanceGraphicsTip);
        this.performanceGraphicsTip.lineStyle(this.performanceLineWidth, 0xFFA500);

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
        this.doMultiGraphicMove(this.startTimeX, this.previousY);
        this.performanceDirection = null;
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
        this.startTimeX = this.width / 2;

        this.initialize();
    }

    setPlayer(player) {
        this.player = player;
        this.initialize();
    }
}
