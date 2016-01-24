/**
 * Adapted from James Edwards article here:
 *  http://www.sitepoint.com/creating-accurate-timers-in-javascript/
 */

"use strict";

function BeatTimer(){
    var startTime = null;
    var timerLength = null;
    var minute = 60000;

    // 10 notes @ 120bpm = (60 / 120) * 10 = 5 seconds
    function _beginTimer(numBeats, bpm){
        var beatLength = timerLength / numBeats,
            elapsedBeats = 0;
        timerLength = numBeats * (minute / bpm);

        function _instance(){
            if (elapsedBeats++ === numBeats) {
                _onComplete();
            }
            else {
                _onInstance();

                var diff = (new Date().getTime() - startTime) - (elapsedBeats * beatLength);
                //window.setTimeout(_instance, (beatLength - diff));
                setTimeout(_instance, (beatLength - diff));
            }
        }

        //window.setTimeout(_instance, beatLength);
        startTime = new Date().getTime();
        setTimeout(_instance, beatLength);
    }

    function _onComplete(){}

    function _onInstance(){}

    this.start = function(numBeats, bpm){
        _beginTimer(numBeats, bpm);
    };

    this.getPercentComplete = function(){
        // the result of thsi function has 1 ms of latency
        var elapsedTime = (new Date().getTime() - startTime);
        return elapsedTime / timerLength;
    };

}

module.exports = BeatTimer;
