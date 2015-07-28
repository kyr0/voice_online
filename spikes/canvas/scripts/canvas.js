"use strict";

    requirejs(['fabric'],

    function(fabric) {

        var canvas = new fabric.Canvas('c');

        var xUnitNum = 8;
        var yUnitNum = 14;
        var yGridUnit = canvas.getHeight() / yUnitNum;
        var xGridUnit = canvas.getWidth() / xUnitNum;
        for (var i = 0; i < xUnitNum; i++) {
            canvas.add(
                new fabric.Line([xGridUnit*i,0, xGridUnit*i,canvas.getHeight()], {
                    stroke: '#000000',
                    strokeWidth:0.2,
                    selectable: false
                })
            );
        }
        for (var cnt = 0; cnt < yUnitNum; cnt++) {
            canvas.add(
                new fabric.Line([0,yGridUnit*cnt,canvas.getWidth(),yGridUnit*cnt], {
                    stroke: '#000000',
                    strokeWidth:0.2,
                    selectable: false
                })
            );
        }

        canvas.add(
            // Arc description: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
            new fabric.Path("M 50 50" + // startPoint = curX = gridX[1], curY = gridY[1]
                "A 25 25 0 1 0 50 100" + // arc 1 (rad, rad, 0, 1, 0, curX, curY(rad*2)
                "L 100 100" +  // x = curX(50) + widthTarget(xGridUnit * numBeats) - rad*2, y = curY
                "A 25 25 0 1 0 100 50 z",   // arc 2  (rad, rad, 0, 1, 0,
                {
                    stroke: 'red',
                    strokeWidth: 2,
                    fill: "none"
                })
        );
    })();
