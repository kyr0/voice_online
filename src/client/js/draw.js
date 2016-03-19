// This is PaperScript
'use strict';

// TODO optimize by planning the whole lesson, all information is calculated at creation and
// TODO    not during execution.

var height = view.size.height;
var width = view.size.width;

var curSet = null;
var range = null;
var lessonLength = null;
var measureCount = null;
var unitHeight = null;
var unitWidth = null;
var border = null;
var gridX = [];
var gridY = [];
var bubbles = [];
var noteLbls = [];
var timeline = null;
var dot = null;
var timeGroup = null;


var initLessonCanvas = function() {
    curSet = window.lPlayer.getCurrentSet();
    range = curSet.getLessonRange() + 2;  // pad top and bottom
    lessonLength = curSet.lengthInMeasures;
    measureCount = Math.floor(lessonLength);
    unitHeight = height / range;
    unitWidth = width / lessonLength;
    resetDrawables();
    resetPlayerListenersInDraw();
    initWidget();
};
window.initLessonCanvas = initLessonCanvas;


function resetPlayerListenersInDraw(){

    window.lPlayer.on("stopExercise", function(){
        console.log("stopEx");
        timeGroup.visible = false;
    });

    window.lPlayer.on("endSet", function(){
        console.log("endSet");
        updateSet();
    });

    window.lPlayer.on("endExercise", function(){
        console.log("endEx");
        timeGroup.visible = false;
    });

    window.lPlayer.on("startExercise", function(){
        console.log("startEx");
        timeGroup.visible = true;
    });
}


function resetDrawables() {
    project.clear();  // clear any potential previous lessons off
    border = null;
    gridX = [];
    gridY = [];
    bubbles = [];
    noteLbls = [];
    timeline = null;
    dot = null;
    timeGroup = null;
}


function initWidget() {
    border = new Path.Rectangle({
        rectangle: view.bounds,
        strokeWidth: 0,
        fillColor: '#282828'
    });

    var vert = new Path.Line(new Point(0, 0), new Point(0, height));
    vert.strokeColor = 'grey';
    var symbolVert = new Symbol(vert);
    gridX.push(symbolVert);
    for (var msr = 0; msr < measureCount; msr++) {
        var x = unitWidth * (msr + 1);
        gridX.push(symbolVert.place(new Point(x, height / 2)));
    }

    var horz = new Path.Line(new Point(0, 0), new Point(width, 0));
    horz.strokeColor = 'grey';
    var symbolHorz = new Symbol(horz);
    gridY.push(symbolHorz);
    for (var semi = 1; semi < range; semi++) {
        var y = unitHeight * semi;
        gridY.push(symbolHorz.place(new Point(width / 2, y)));
    }

    var consumedX = 0;
    var tmpNtNames = [];  // used to filter out duplicate note labels
    for (var nt = 0; nt < curSet.notes.length; nt++) {
        var curNote = curSet.notes[nt];
        var curNoteWidth = unitWidth * curNote.lengthInMeasures;
        var curNoteY = unitHeight * curNote.relativeInterval + (unitHeight / 2);

        // Bubble related
        var bubRect = new Rectangle(consumedX, curNoteY, curNoteWidth, unitHeight);
        var cornerSize = new Size((unitWidth / 6),(unitHeight / 2));
        var bubble = new Path.RoundRectangle(bubRect, cornerSize);
        bubble.fillColor = 'AntiqueWhite';
        bubbles.push(bubble);
        consumedX += curNoteWidth;

        // Note label related
        if (!tmpNtNames[curNote.name]) {
            tmpNtNames[curNote.name] = 1;
            var noteName = new PointText([20, curNoteY + (unitHeight / 2)]);
            noteName.content = curNote.name;
            noteName.strokeColor = 'coral';
            var idx = noteLbls.push(noteName);
            noteLbls[idx - 1].ntObj = curNote;
            noteLbls[idx - 1].relativeInterval = curNote.relativeInterval;
        }
    }

    timeline = new Path({
        strokeColor: 'CadetBlue'
    });
    timeline.add(new Point(0, 0), new Point(0, height));

    dot = new Path.Circle({
        center: [0, unitHeight],
        radius: unitHeight / 2,
        fillColor: 'coral'
    });
    timeGroup = new Group([timeline, dot]);
    timeGroup.visible = false;
}

function updateSet(){
    for (var lbl = 0; lbl < noteLbls.length; lbl++) {
        var curNoteLbl = noteLbls[lbl];
        curNoteLbl.ntObj = curNoteLbl.ntObj.nextNote;
        curNoteLbl.content = curNoteLbl.ntObj.name;
    }
}


function onFrame(event) {
    if (window.lPlayer) {
        if (window.lPlayer.isPlaying) {
            var pctComplete = window.lPlayer.getPctComplete();
            timeGroup.position.x = width * pctComplete;
            var yRatio = window.pitchYAxisRatio;
            if (yRatio) {
                dot.position.y = unitHeight * yRatio;
                dot.visible = true;
            }
            else {
                dot.visible = false;
            }
        }
    }
}


jQuery(window).on('resize', function(){
    height = view.size.height;
    width = view.size.width;
    unitHeight = height / range;
    unitWidth = width / lessonLength;

    border.bounds = view.bounds;

    gridX[0].definition.segments = [[0, 0], [0, height]];
    for (var msr = 1; msr < gridX.length; msr++) {
        var x = unitWidth * msr;
        gridX[msr].position = new Point(x, height / 2);
    }
    gridY[0].definition.segments = [[0, 0], [width, 0]];
    for (var semi = 1; semi < gridY.length; semi++) {
        var y = unitHeight * semi;
        gridY[semi].position = new Point(width / 2, y);
    }

    var consumedX = 0;
    for (var nt = 0; nt < curSet.notes.length; nt++) {
        var curNote = curSet.notes[nt];
        var curNoteY = unitHeight * curNote.relativeInterval + (unitHeight / 2);
        var curNoteWidth = unitWidth * curNote.lengthInMeasures;

        var bubRect = new Rectangle(consumedX, curNoteY, curNoteWidth, unitHeight);
        var cornerSize = new Size((unitWidth / 6),(unitHeight / 2));
        var bubble = new Path.RoundRectangle(bubRect, cornerSize);
        bubble.fillColor = 'AntiqueWhite';
        bubbles[nt].remove();
        bubbles[nt] = bubble;
        consumedX += curNoteWidth;
    }

    for (var lbl = 0; lbl < noteLbls.length; lbl++) {
        noteLbls[lbl].position = [20, unitHeight * (1 + noteLbls[lbl].relativeInterval)];
        noteLbls[lbl].insertAbove(bubbles[bubbles.length - 1]);
    }

    timeline.remove();
    timeline = new Path();
    timeline.strokeColor = 'CadetBlue';
    timeline.add(new Point(0, 0), new Point(0, height));

    dot.remove();
    dot = new Path.Circle({
        center: [0, unitHeight],
        radius: unitHeight / 2,
        fillColor: 'coral'
    });

    timeGroup.remove();
    timeGroup = new Group([timeline, dot]);

});
