var dot = new Path.Circle({
    center: new Point(150, 290),
    radius: 3,
    fillColor: 'darkgrey'
});

var range = 108;
var unitSize = view.size.height / range;
var gridArray = [];

for (var i = 0; i < range; i++) {
    gridArray.push(unitSize * i);
}

function onFrame(event) {
    var freq = window.pitchFreq;
    if (freq !== -1) {
        dot.position = new Point(150, gridArray[Math.abs((Math.round(12 * (Math.log(freq / 440) / Math.log(2)) + 57)) - range)] );
    }
    else {
        dot.position = new Point(150,0);
    }
}