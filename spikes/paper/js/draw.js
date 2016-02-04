// This is PaperScript

var height = view.size.height;
var width = view.size.width;
var curLesson = window.lessons[0];
var range = curLesson.getLessonRange() + 2;  // pad top and bottom
var measureCount = Math.floor(curLesson.getLessonLength()) + 1; // todo: bug
var unitHeight = height / range;
var unitWidth = width / measureCount;

var timeGroup = null;

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
        var vert = new Path(new Point(x, 0), new Point(x, height));
        vert.strokeColor = 'grey';
        grid.push(vert);
    }
    for (var semi = 1; semi < range; semi++) {
        y = unitHeight * semi;
        var horz = new Path(new Point(0, y), new Point(width, y));
        horz.strokeColor = 'grey';
        grid.push(horz);
    }

    var bubbles = [];
    var noteLbls = [];
    var consumedX = 0;
    for (var nt = 0; nt < curLesson.notes.length; nt++) {
        var curNote = curLesson.notes[nt];
        var curNoteWidth = unitWidth * curNote.relativeLength;
        var curNoteY = unitHeight * curNote.relativeInterval + (unitHeight / 2);

        // Bubble related
        var bubRect = new Rectangle(consumedX, curNoteY, curNoteWidth, unitHeight);
        var cornerSize = new Size((unitWidth / 6),(unitHeight / 2));
        var bubble = new Path.RoundRectangle(bubRect, cornerSize);
        bubble.fillColor = 'AntiqueWhite';
        bubbles.push(bubble);
        consumedX += curNoteWidth;

        // Note label related
        var noteName = new PointText([10, curNoteY + (unitHeight / 2)]);
        noteName.content = curNote.name;
        noteName.strokeColor = 'white';
        noteLbls.push(noteName);
    }

    var timeline = new Path();
    timeline.strokeColor = 'CadetBlue';
    timeline.add(new Point(0, 0), new Point(0, height));

    var dot = new Path.Circle({
        center: [0, unitHeight],
        radius: unitHeight / 2,
        fillColor: 'coral'
    });

    timeGroup = new Group([timeline, dot]);

}

draw();


function onFrame(event) {
    freq = window.pitchFreq;
    timeGroup.position.x = width * window.percentComplete;

    if (freq !== -1) {
        //dot.position.y = gridArray[Math.abs((Math.round(12 * (Math.log(freq / 440) / Math.log(2)) + 57)) - range)];
    }
    else {}
}

function onResize(event) {
    height = view.size.height;
    width = view.size.width;
    unitHeight = height / range;
    unitWidth = width / measureCount;
    draw();
}