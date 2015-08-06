"use strict";

    var fbr = require('./bower_components/fabric/dist/fabric.js');
    var fabric = fbr.fabric;
    //var fabric = require('./bower_components/fabric/dist/fabric.require.js');
    //requirejs(['fabric'],
    //
    //function(fabric) {

        var xUnitNum = 8;
        var yUnitNum = 14;

        var canvas = makeCanvas(700, 400, xUnitNum, yUnitNum);

        var xGridUnit = canvas.getWidth() / xUnitNum;
        var yGridUnit = canvas.getHeight() / yUnitNum;

        drawGrid(canvas, xUnitNum, yUnitNum);

        function makeCanvas(cvsWidth, cvsHeight, xUnitNum, yUnitNum) {
            var cvs = new fabric.Canvas('c', {selection: false});
            cvs.setDimensions({width: cvsWidth, height: cvsHeight});

            return cvs;

        }

        function drawGrid(cvs, xUnitNum, yUnitNum) {

            var lineOpts = {
                stroke: '#000000',
                strokeWidth: 0.2,
                selectable: false
            };
            for (var i = 0; i < xUnitNum; i++) {
                cvs.add(new fabric.Line([xGridUnit * i, 0, xGridUnit * i, cvs.getHeight()], lineOpts));
            }
            for (var cnt = 0; cnt < yUnitNum; cnt++) {
                cvs.add(new fabric.Line([0, yGridUnit * cnt, cvs.getWidth(), yGridUnit * cnt], lineOpts));
            }
        }

        var Bubble = fabric.util.createClass(fabric.Path, {
            // TODO: test that drawing a rect with same coords contains a bubble perfectly
            // given x, y, width and height, draw a pill bubble using Path
            // Here's a nice example on how to extend classes: http://fabricjs.com/cross/
            type: 'Bubble',

            initialize: function(x, y, width, height, options) {
                // TODO maybe need to set the options width, height, x, y??
                var radius = height / 2;
                var path = "M " + (x + radius) + " " + y +
                    " A " + radius + " " + radius + " 0 1 0 " + (x + radius) + " " + (height + y) +
                    " L " + (x + width - radius) + " " + (y + height) +
                    " A " + radius + " " + radius + " 0 1 0 " + (x + width - radius) + " " + y + " z";
                //console.log(path);
                options.selectable = false;
                this.callSuper('initialize', path, options);

            },

            animateGradient: function () { // TODO: implement this
            },
            _render: function(ctx) {
                this.callSuper('_render', ctx);
            }
        });



        // test to see if rect / path overlap in the corners
        canvas.add(
            new fabric.Rect({
                width: (xGridUnit*3), height: yGridUnit,
                left: xGridUnit, top: yGridUnit,
                fill: 'yellow'
            }),
            new Bubble(xGridUnit, yGridUnit, (xGridUnit*2), yGridUnit, {
                fill: "green"
            })
        );

        var point = new fabric.Point(4*xGridUnit, 2*yGridUnit);
        var objArr = [];
        canvas.forEachObject(function(obj) {
            if (obj.containsPoint(point)) {
                objArr.push(obj);
            }
            if (obj.type === "line") {

                if (obj.left === xGridUnit) {
                    console.log(obj.left);
                }
                if (obj.top === yGridUnit) {
                    console.log(obj.top);
                }
            }
        });
        for (var i = 0; i < objArr.length; i++) {
            console.log(objArr[i].toString());
            console.log(xGridUnit + " " + yGridUnit);
        }

    //})();
