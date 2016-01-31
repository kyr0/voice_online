// This is PaperScript

var height = view.size.height;
var width = view.size.width;
var curLesson = window.lessons[0];
var range = curLesson.getLessonRange();
console.log("RANGE: " + range); // should not be 11 should be 5 or 6
var measureCount = curLesson.getLessonLength();
var unitHeight = height / range;
var unitWidth = width / measureCount;
var gridArray = [];

var pct = 0;
var freq = null;

//var border = new Path.Rectangle({
//    rectangle: view.bounds,
//    strokeColor: 'black',
//    strokeWidth: 1
//});

var grid = [];
for (var msr = 1; msr < measureCount; msr++){
    x = unitWidth * msr;
    var path = new Path(new Point(x, 0), new Point(x, height));
    path.strokeColor = 'black';
    grid.push(path);
}
for (var semi = 1; semi < range; semi++){
    y = unitHeight * semi;
    var path = new Path(new Point(0, y), new Point(width, y));
    path.strokeColor = 'black';
    grid.push(path);
}


var timeline =  new Path();
timeline.strokeColor = 'black';
timeline.add(new Point(0, 0), new Point(0, height));

var dot = new Path.Circle({
    center: [0, 0],
    radius: 20,
    fillColor: 'black'
});

var timeGroup = new Group([dot, timeline]);
timeGroup.onFrame = function(event) {
    this.position.x = width * window.percentComplete;
};

// TODO get rid of this shit, do something more elegant with smoother visual
// divides the canvas into chunks based on range size
for (var i = 0; i < range; i++) {
    gridArray.push(unitHeight * i);
}

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
}