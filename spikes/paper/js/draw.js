// This is PaperScript

var height = view.size.height;
var width = view.size.width;
var curSet = window.lPlayer.getCurrentSet();
var range = curSet.getLessonRange() + 2;  // pad top and bottom
var measureCount = Math.floor(curSet.getLessonLength()) + 1; // todo: bug
var unitHeight = height / range;
var unitWidth = width / measureCount;

var consumedX = 0;
var lastPctComplete = 0;
var initHasRun = false;
var freq = null;

var border = null;
var grid = null;
var bubbles = null;
var noteLbls = null;
var timeline = null;
var dot = null;
var timeGroup = null;


function initWidget() {

    border = new Path.Rectangle({
        rectangle: view.bounds,
        strokeColor: 'grey',
        strokeWidth: 1,
        fillColor: '#282828'
    });

    grid = [];
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

    bubbles = [];
    consumedX = 0;
    curSet = window.lPlayer.getCurrentSet();
    for (var nt = 0; nt < curSet.notes.length; nt++) {
        var curNote = curSet.notes[nt];
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
        noteLbls = [];
        var noteName = new PointText([10, curNoteY + (unitHeight / 2)]);
        noteName.content = curNote.name;
        noteName.strokeColor = 'white';
        noteLbls.push(noteName);
    }

    console.log("LENGTH: " + noteLbls.length);

    timeline = new Path();
    timeline.strokeColor = 'CadetBlue';
    timeline.add(new Point(0, 0), new Point(0, height));

    dot = new Path.Circle({
        center: [0, unitHeight],
        radius: unitHeight / 2,
        fillColor: 'coral'
    });

    timeGroup = new Group([timeline, dot]);
    initHasRun = true;
}

function updateSet(){
    curSet = window.lPlayer.getCurrentSet();
    console.log(curSet.notes.length);
    if (noteLbls.length == curSet.notes.length){
        for (var nt2 = 0; nt2 < curSet.notes.length; nt2++) {
            var curNote = curSet.notes[nt2];
            noteLbls[nt2].content = curNote.name;
            console.log(noteLbls[nt2].content);
        }
    }
}


function onFrame(event) {
    if (initHasRun) {
        var pctComplete = window.percentComplete;
        freq = window.pitchFreq;
        timeGroup.position.x = consumedX * pctComplete;

        if (pctComplete < lastPctComplete) {
            updateSet();
        }
        lastPctComplete = pctComplete;

        if (freq !== -1) {
            //dot.position.y = gridArray[Math.abs((Math.round(12 * (Math.log(freq / 440) / Math.log(2)) + 57)) - range)];
        }
        else {
        }
    }
}

function onResize(event) {
    height = view.size.height;
    width = view.size.width;
    unitHeight = height / range;
    unitWidth = width / measureCount;
    initWidget();
}

initWidget();