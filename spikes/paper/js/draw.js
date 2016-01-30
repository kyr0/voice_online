// This is PaperScript

var height = view.size.height;
var width = view.size.width;
var range = 108;
var unitSize = height / range;
var gridArray = [];

var pct = 0;
var freq = null;

//var border = new Path.Rectangle({
//    rectangle: view.bounds,
//    strokeColor: 'black',
//    strokeWidth: 1
//});

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
    console.log(window.percentComplete);
    this.position.x = width * window.percentComplete;
};

// TODO get rid of this shit, do something more elegant with smoother visual
// divides the canvas into chunks based on range size
for (var i = 0; i < range; i++) {
    gridArray.push(unitSize * i);
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
    unitSize = height / range;
}