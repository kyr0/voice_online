///**
// * Created by jaboing on 2015-07-27.
// */
//"use strict";
//
//requirejs(['fabric', 'canvas'],
//
//    function(fabric) {
//
//    exports.setUp = function() {
//
//
//        canvas.add(
//            new fabric.Rect({
//                width: (xGridUnit * 3), height: yGridUnit,
//                left: xGridUnit, top: yGridUnit,
//                fill: 'yellow'
//            }),
//            new Bubble(xGridUnit, yGridUnit, (xGridUnit * 2), yGridUnit, {
//                fill: "green"
//            })
//        );
//
//    };
//
//// test to see if rect / path overlap in the corners
//        exports.test_RectAndBubbleOverlapInCorners = function(test) {
//            canvas.forEachObject(function (obj) {
//                if (obj.containsPoint(point)) {
//                    objArr.push(obj);
//                }
//                if (obj.type === "line") {
//
//                    if (obj.left === xGridUnit) {
//                        console.log(obj.left);
//                    }
//                    if (obj.top === yGridUnit) {
//                        console.log(obj.top);
//                    }
//                }
//            });
//            for (var obj in objArr) {
//                console.log(objArr[obj].toString());
//                console.log(xGridUnit + " " + yGridUnit)
//            }
//        }
//
//    }
//);