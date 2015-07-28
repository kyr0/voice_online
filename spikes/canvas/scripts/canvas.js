"use strict";

    requirejs(['fabric'],

    function(fabric) {

        var canvas = makeCanvas(700, 400, 8, 14);

        function makeCanvas(cvsWidth, cvsHeight, xUnitNum, yUnitNum) {
            var cvs = new fabric.Canvas('c', {selection: false});
            cvs.setDimensions({width: cvsWidth, height: cvsHeight});
            _drawGrid(cvs, xUnitNum, yUnitNum);
            return cvs;

        }

        function _drawGrid(cvs, xUnitNum, yUnitNum) {
            var xGridUnit = cvs.getWidth() / xUnitNum;
            var yGridUnit = cvs.getHeight() / yUnitNum;
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
                this.callSuper('initialize', path, options);

            },

            animateGradient: function () {
            }, // TODO: implement this
            _render: function(ctx) {
                this.callSuper('_render', ctx);
            }
        });

        canvas.add(
            new fabric.Rect({
                width: 100, height: 50,
                left: 50, top: 50,
                fill: 'yellow'
            }),
            new Bubble(50, 50, 100, 50, {
                fill: "green"
            })
        );

            //canvas.add(
            //    // Arc description: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
            //    new fabric.Path("M 50 50" + // startPoint = curX = gridX[1], curY = gridY[1]
            //        "A 25 25 0 1 0 50 100" + // arc 1 (rad, rad, 0, 1, 0, curX, curY + (rad*2)
            //        "L 100 100" +  // x = curX(50) + widthTarget(xGridUnit * numBeats) - rad*2, y = curY
            //        "A 25 25 0 1 0 100 50 z",   // arc 2  (rad, rad, 0, 1, 0,
            //        {
            //            stroke: 'red',
            //            strokeWidth: 2,
            //            fill: "none",
            //            selectable: false
            //        })
            //);

    })();
