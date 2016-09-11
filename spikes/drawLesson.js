// This is PaperScript
'use strict';

// TODO optimize by planning the whole lesson, all information is calculated at creation and not during execution.

var height = view.size.height;
var width = view.size.width;
var captionHeight = height * 0.125;
var lessonHeight = height - captionHeight;

var curSet = null;
var range = null;
var lessonDuration = null;
var measureCount = null;
var unitHeight = null;
var unitWidth = null;
var lessonBg = null;
var captionBg = null;
var gridX = [];
var gridY = [];
var bubbles = [];
var captionList = [];
var scoreBoard = [];
var noteLbls = [];
var timeline = null;
var dot = null;
var timeGroup = null;
var templateSet = null;

var lessonLayer = project.activeLayer;
var markerLayer = new Layer();


var initLessonCanvas = function() {
    curSet = window.lPlayer.getCurrentSet();
    templateSet = curSet;
    range = curSet.getLessonRange() + 2;  // pad top and bottom
    lessonDuration = curSet.durationInMeasures;
    measureCount = Math.floor(lessonDuration);
    unitHeight = lessonHeight / range;
    unitWidth = width / lessonDuration;
    resetDrawables();
    resetPlayerListenersInDraw();
    initWidget();
};
window.initLessonCanvas = initLessonCanvas;


function resetPlayerListenersInDraw(){

    window.lPlayer.on("stopExercise", function(){
        timeGroup.visible = false;
    });

    window.lPlayer.on("endSet", function(){
        updateSet();
    });

    window.lPlayer.on("endExercise", function(aggNoteScores){
        timeGroup.visible = false;
        drawScores(aggNoteScores);
    });

    window.lPlayer.on("startExercise", function(){
        timeGroup.visible = true;
    });
}


function resetDrawables() {
    project.clear();  // clear any potential previous lessons off
    lessonLayer = project.activeLayer;
    markerLayer = new Layer();
    lessonBg = null;
    captionBg = null;
    gridX = [];
    gridY = [];
    bubbles = [];
    captionList = [];
    scoreBoard = [];
    noteLbls = [];
    timeline = null;
    dot = null;
    timeGroup = null;
}


function initWidget() {
    lessonLayer.activate();

    lessonBg = new Path.Rectangle({
        x:0,
        y:0,
        width: width,
        height: lessonHeight,
        strokeWidth: 0,
        fillColor: '#282828'
    });

    captionBg = new Path.Rectangle({
        x:0,
        y:lessonHeight,
        width: width,
        height: (height - lessonHeight),
        strokeWidth: 0,
        fillColor: 'AntiqueWhite'
    });

    var vert = new Path.Line(new Point(0, 0), new Point(0, lessonHeight));
    vert.strokeColor = 'grey';
    var symbolVert = new Symbol(vert);
    gridX.push(symbolVert);
    for (var msr = 0; msr < measureCount; msr++) {
        var x = unitWidth * (msr + 1);
        gridX.push(symbolVert.place(new Point(x, lessonHeight / 2)));
    }

    var horz = new Path.Line(new Point(0, 0), new Point(width, 0));
    horz.strokeColor = 'grey';
    var symbolHorz = new Symbol(horz);
    gridY.push(symbolHorz);
    for (var semi = 1; semi < range; semi++) {
        var y = unitHeight * semi;
        gridY.push(symbolHorz.place(new Point(width / 2, y)));
    }

    // Begin epic bubble drawing
    var consumedX = 0;
    var tmpNtNames = [];  // used to filter out duplicate note labels
    for (var nt = 0; nt < curSet.noteList.length; nt++) {
        var curNote = curSet.noteList[nt];
        var curNoteWidth = unitWidth * curNote.durationInMeasures;
        var curNoteY = unitHeight * curNote.relativeInterval + (unitHeight / 2);

        // Bubble related
        var bubRect = new Rectangle(consumedX, curNoteY, curNoteWidth, unitHeight);
        var cornerSize = new Size((unitWidth / 6),(unitHeight / 2));
        var bubble = new Path.RoundRectangle(bubRect, cornerSize);
        bubble.fillColor = 'AntiqueWhite';
        if (curNote.name === '-') {
            bubble.visible = false;
        }
        bubbles.push(bubble);
        consumedX += curNoteWidth;

        // Note label related
        if (!tmpNtNames[curNote.name] && curNote.name !== '-') {
            tmpNtNames[curNote.name] = 1;
            var noteName = new PointText([20, curNoteY + (unitHeight / 2)]);
            noteName.content = curNote.name;
            noteName.strokeColor = 'coral';
            var idx = noteLbls.push(noteName);
            noteLbls[idx - 1].ntObj = curNote;
            noteLbls[idx - 1].relativeInterval = curNote.relativeInterval;
        }
    }

    // Begin caption drawing
    var consumedCaptionX = 0;
    for (var cap = 0; cap < curSet.captionList.length; cap++) {
        var curCap = curSet.captionList[cap];
        var curCapWidth = unitWidth * curCap.durationInMeasures;
        var capY = lessonHeight + (captionHeight / 2);
        var captionText = new PointText([consumedCaptionX, capY]);
        captionText.content = curCap.text;
        captionText.strokeColor = 'coral';
        captionList.push(captionText);
        consumedCaptionX += curCapWidth;
    }

    markerLayer.activate();
    timeline = new Path({
        strokeColor: 'CadetBlue'
    });
    timeline.add(new Point(0, 0), new Point(0, lessonHeight));

    dot = new Path.Circle({
        center: [0, unitHeight],
        radius: unitHeight / 2,
        fillColor: 'coral'
    });
    timeGroup = new Group([timeline, dot]);
    timeGroup.visible = false;
}


function drawScores(aggNoteScores) {
    var consumedX = 0;
    for (var scr = 0; scr < aggNoteScores.length; scr++) {
        var curNote = templateSet.noteList[scr];
        var curNoteWidth = unitWidth * curNote.durationInMeasures;
        var curNoteY = unitHeight * curNote.relativeInterval + (unitHeight / 2);
        var scoreText = new PointText([consumedX, curNoteY]);
        scoreText.content = Math.round(aggNoteScores[scr]);
        scoreText.strokeColor = 'black';
        scoreBoard.push(scoreText);
        consumedX += curNoteWidth;
    }
}



function updateSet(){
    for (var lbl = 0; lbl < noteLbls.length; lbl++) {
        var curNoteLbl = noteLbls[lbl];
        curNoteLbl.ntObj = curNoteLbl.ntObj.getNextNote();
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
