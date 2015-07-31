"use strict";

    var fbr = require('./bower_components/fabric/dist/fabric.js');
    //var fbr = require('../../../node_modules/fabric-browserify/dist/fabric.js');
    var fabric = fbr.fabric;

    console.log(fabric.toString());

    var canvas = new fabric.Canvas('c');
    canvas.setDimensions({width: 700, height: 400});
    // create a rectangle object
    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
    });

    // "add" rectangle onto canvas
    canvas.add(rect);
    canvas.renderAll(true);
    console.log(canvas.toString());

