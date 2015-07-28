/**
 * Created by jaboing on 2015-07-27.
 */
/**
 * Created by jaboing on 2015-07-27.
 */

(function BubblesGalore() {

    var widthRatio = 1.25;
    var bubbleHeight = 20;
    var xScale;
    var yScale;
    var windowWidth;
    var windowHeight;

    // TODO refactor with real midi values
    function midiCoordinate(x, y, noteLen) {
        this.x = x;
        this.y = y;
        this.leng = noteLen;
    }
    var ntArr = new Array();
    //ntArr.push(new midiCoordinate(getX(), getY(), 1));
    ntArr.push(new midiCoordinate(75, 70, 2));
    ntArr.push(new midiCoordinate(125, 90, 1));
    ntArr.push(new midiCoordinate(150, 110, 4));

    CanvasRenderingContext2D.prototype.midiBubble =

        function (x, y, noteLength) {
            bubbleHeight = (bubbleHeight * yScale);
            var radius = (bubbleHeight / 2);
            var width = (xScale * bubbleHeight * widthRatio * noteLength);
            var angle1 = Math.PI * 0.5;
            var angle2 = Math.PI * 1.5;
            var antiClockwise = false;
            this.beginPath();
            this.arc(x, y, radius, angle1, angle2, antiClockwise);
            this.lineTo(width - radius, y - radius);
            this.arc(x + width, y, radius, angle2, angle1, antiClockwise);
            this.closePath();
            this.fillStyle = "#7DB4B5";
            this.fill();
        }


    var my_canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = my_canvas.getContext('2d');
    } else {
        // canvas-unsupported code here
    }

    initialize();

    function initialize() {
        xScale = 1;
        yScale = 1;
        // Register an event listener to
        // call the resizeCanvas() function each time
        // the window is resized.
        window.addEventListener('resize', resizeCanvas, false);

        // Draw canvas for the first time.

        resizeCanvas();
    }


    // Display custom canvas.
    // In this case it's a blue, 5 pixel border that
    // resizes along with the browser window.
    function redraw() {
        for (var i = 0; i < ntArr.length; i++) {
            var x = (ntArr[i].x * xScale);
            var y = (ntArr[i].y * yScale);
            var leng = ntArr[i].leng;
            ctx.midiBubble(x, y, leng);
        }
    }

    function getScaleRatio() {
        xScale = window.innerWidth / windowWidth;
        yScale = window.innerHeight / windowHeight;
    }


    // Runs each time the DOM window resize event fires.
    // Resets the canvas dimensions to match window,
    // then draws the new borders accordingly.
    function resizeCanvas() {
        my_canvas.width = window.innerWidth;
        my_canvas.height = window.innerHeight;
        if (windowHeight !== undefined) {
            getScaleRatio();
        }
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        redraw();
    }


})();