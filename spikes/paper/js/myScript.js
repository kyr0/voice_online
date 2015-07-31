// Get our canvas
var canvas = $('#canvas')[0].getContext("2d");

// Draw a circle
canvas.beginPath();
canvas.arc(100, 100, 15, 0, Math.PI*2, true);

// Close the path
canvas.closePath();

// Fill it in
canvas.fill('red');