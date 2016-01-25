// this is paperscript, responsible for drawing the dot
//  uses the pitchFreq variable set in the window
var dot = new Path.Circle({
    radius: 30,
    fillColor: 'black'
});

var range = 108;
var unitSize = view.size.height / range;
var width = view.size.width;
var gridArray = [];

// divides the canvas into chunks based on range size
// TODO horizontal grid
for (var i = 0; i < range; i++) {
    gridArray.push(unitSize * i);
}

function onFrame(event) {
    var freq = window.pitchFreq;
    var pct = window.percentComplete;
    var x = Math.round(width * pct);
    console.log(x);
    if (freq !== -1) {
        dot.position = [x, gridArray[Math.abs((Math.round(12 * (Math.log(freq / 440) / Math.log(2)) + 57)) - range)]];
    }
    else {
        dot.position = [10, 10];
    }
}