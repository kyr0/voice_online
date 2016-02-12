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
var gridX = [];
var gridY = [];
var bubbles = [];
var noteLbls = [];
var timeline = null;
var dot = null;
var timeGroup = null;


function initWidget() {
    console.log("INITWIDGET YAYA");

    border = new Path.Rectangle({
        rectangle: view.bounds,
        strokeColor: 'grey',
        strokeWidth: 1,
        fillColor: '#282828'
    });

    for (var msr = 1; msr < measureCount; msr++) {
        x = unitWidth * msr;
        var vert = new Path.Line(new Point(x, 0), new Point(x, height));
        vert.strokeColor = 'grey';
        gridX.push(vert);
    }
    for (var semi = 1; semi < range; semi++) {
        y = unitHeight * semi;
        var horz = new Path.Line(new Point(0, y), new Point(width, y));
        horz.strokeColor = 'grey';
        gridY.push(horz);
    }

    consumedX = 0;
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
        var noteName = new PointText([10, curNoteY + (unitHeight / 2)]);
        noteName.content = curNote.name;
        noteName.strokeColor = 'white';
        noteLbls.push(noteName);
    }

    timeline = new Path();
    timeline.strokeColor = 'CadetBlue';
    timeline.add(new Point(0, 0), new Point(0, height));

    dot = new Path.Circle({
        center: [0, unitHeight],
        radius: unitHeight / 2,
        fillColor: 'coral',
        //blendMode: 'negation'
    });

    timeGroup = new Group([timeline, dot]);
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

jQuery(window).on('resize', function(){
    console.log("ONRESIZE WOOOOOO!");
    var scaleX = view.size.width / width;
    var scaleY = view.size.height / height;
    height = view.size.height;
    width = view.size.width;
    unitHeight = height / range;
    unitWidth = width / measureCount;

    border.bounds = view.bounds;

    for (var msr = 0; msr < gridX.length; msr++) {
        x = unitWidth * (msr + 1);
        gridX[msr].segments = [[x, 0], [x, height]];
    }
    for (var semi = 0; semi < gridY.length; semi++) {
        y = unitHeight * (semi + 1);
        gridY[semi].segments = [[0, y], [width, y]];
    }

    consumedX = 0;
    for (var nt = 0; nt < curSet.notes.length; nt++) {
        var curNote = curSet.notes[nt];
        var curNoteWidth = unitWidth * curNote.relativeLength;
        var curNoteY = unitHeight * curNote.relativeInterval + (unitHeight / 2);

        // Bubble related
        console.log(bubbles[nt]);
        var bubRect = new Rectangle(consumedX, curNoteY, curNoteWidth, unitHeight);
        var cornerSize = new Size((unitWidth / 6),(unitHeight / 2));
        var bubble = new Path.RoundRectangle(bubRect, cornerSize);
        consumedX += curNoteWidth;

        // Note label related
        var noteName = new PointText([10, curNoteY + (unitHeight / 2)]);
        noteName.content = curNote.name;
        noteName.strokeColor = 'white';
        noteLbls.push(noteName);
    }


});

jQuery(document).ready(function() {
    curSet = window.lPlayer.getCurrentSet();
    console.log("HEY HEY ONREADY SUCKAS");
    initWidget();
    initHasRun = true;
});
