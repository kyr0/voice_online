// This is PaperScript

var height = view.size.height;
var width = view.size.width;
var curLesson = window.lessons[0];
var range = curLesson.getLessonRange() + 2;  // pad top and bottom
var measureCount = Math.floor(curLesson.getLessonLength()) + 1; // todo: bug
var unitHeight = height / range;
var unitWidth = width / measureCount;
var gridArray = [];

var pct = 0;
var freq = null;

function draw() {
    var border = new Path.Rectangle({
        rectangle: view.bounds,
        strokeColor: 'grey',
        strokeWidth: 1,
        fillColor: '#282828'
    });

    var grid = [];
    for (var msr = 1; msr < measureCount; msr++) {
        x = unitWidth * msr;
        var path = new Path(new Point(x, 0), new Point(x, height));
        path.strokeColor = 'grey';
        grid.push(path);
    }
    for (var semi = 1; semi < range; semi++) {
        y = unitHeight * semi;
        var path = new Path(new Point(0, y), new Point(width, y));
        path.strokeColor = 'grey';
        grid.push(path);
    }

    var timeline = new Path();
    timeline.strokeColor = 'white';
    timeline.add(new Point(0, 0), new Point(0, height));

    var dot = new Path.Circle({
        center: [0, 0],
        radius: height * .08,
        fillColor: 'coral'
    });

    var timeGroup = new Group([dot, timeline]);
    timeGroup.onFrame = function (event) {
        this.position.x = width * window.percentComplete;
    };

    var bubbles = [];
    var consumedX = 0;
    for (var bub = 0; bub < curLesson.notes.length; bub++) {
        var curNote = curLesson.notes[bub];
        var curNoteWidth = unitWidth * curNote.relativeLength;
        var curNoteY = unitHeight * curNote.relativeInterval + (unitHeight / 2);
        var bubRect = new Rectangle(consumedX, curNoteY, curNoteWidth, unitHeight);
        var cornerSize = new Size((unitWidth / 6),(unitHeight / 2));
        var bubble = new Path.RoundRectangle(bubRect, cornerSize);
        bubble.fillColor = 'white';
        bubbles.push(bubble);
        consumedX += curNoteWidth;
    }
}

// TODO get rid of this shit, do something more elegant with smoother visual
// divides the canvas into chunks based on range size
for (var i = 0; i < range; i++) {
    gridArray.push(unitHeight * i);
}

draw();


function onFrame(event) {
    freq = window.pitchFreq;
    if (freq !== -1) {
        dot.position.y = gridArray[Math.abs((Math.round(12 * (Math.log(freq / 440) / Math.log(2)) + 57)) - range)];
    }
    else {}
}

function onResize(event) {
    //border.bounds = view.bounds;
    height = view.size.height;
    width = view.size.width;
    unitHeight = height / range;
    unitWidth = width / measureCount;
    draw();
}