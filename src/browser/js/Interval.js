
"use strict";

var Note = require("./Note.js");

function Interval (startNote, endNote) {

    var startFreq;
    var endFreq;

    function getIntervalDirection(startNote, endNote) {
        var direction;
        startFreq = startNote.frequency;
        endFreq = endNote.frequency;
        if (startFreq === endFreq){
            direction = "none";
        }
        else if (startFreq < endFreq) {
            direction = "up";
        }
        else {
            direction = "down";
        }
        return direction;
    }

    var getIntervalDistance = function(startNote, endNote, direction) {
        var halfsteps = 0;
        var stepTo = null;
        var reverseSteps = 1;
        var traversalNote = startNote;

        if (direction === "none") {
            return halfsteps;
        }
        else if (direction === "down") {
            stepTo = "previousNote";
            reverseSteps = -1;
        }
        else {
            stepTo = "nextNote";
        }
        while ((traversalNote.name !== endNote.name)){
            halfsteps += 1;
            if (traversalNote[stepTo] === null) {
                throw new Error ("getIntervalDistance() did not encounter the end point of the interval. End Point: " +
                    endNote.name);
            }
            else traversalNote = traversalNote[stepTo];
        }
        return halfsteps * reverseSteps;
    };

    /* start-test-code */
    this.__testonly__ = {
        getIntervalDistance : getIntervalDistance
    };
    /* end-test-code */

    this.startNote = new Note(startNote);
    this.endNote = new Note(endNote);
    this.direction = getIntervalDirection(this.startNote, this.endNote);
    this.halfsteps = getIntervalDistance(this.startNote, this.endNote, this.direction);
    this.name = this.startNote.name + ":" + this.endNote.name;
}

module.exports = Interval;





