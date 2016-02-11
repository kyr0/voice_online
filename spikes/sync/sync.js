/**
 * Adapted from James Edwards article here: http://www.sitepoint.com/creating-accurate-timers-in-javascript/
 */

var startTime = Date.now();
var elapsedTime = 0;
var c = 1;

// rewrite as a class with methods described below and tests

// 10 notes @ 120bpm = (60 / 120) * 10 = 5 seconds
function beatTimer(beats, bpm, oninstance, oncomplete)
{

    var minute = 60000,
        length = beats * (minute / bpm),
        speed = length / beats,
        count = 0,
        start = new Date().getTime();

    function instance()
    {
        if(count++ == beats)
        {
            oncomplete(beats, count);
        }
        else
        {
            oninstance(beats, count);

            var diff = (new Date().getTime() - start) - (count * speed);
            //window.setTimeout(instance, (speed - diff));
            setTimeout(instance, (speed - diff));
        }
    }

    //window.setTimeout(instance, speed);
    setTimeout(instance, speed);
}

// timer currentBeat property could be used to switch statistic recording to next note
// timer should be on call to provide exact time-passed since start of lesson for Frame events to poll
//    for rendering purposes -- or maybe % complete?
// current-time-location = canvas-width / #notes / (60s / BPM)

beatTimer(11, 320,
    function(steps) {
        elapsedTime = ((Date.now() - startTime) / 1000);
        console.log("Total seconds passed: " + elapsedTime + "\n" +
            "Beat #" + c + "\n");
        c = c+1;
    },
    function() {
        elapsedTime = ((Date.now() - startTime) / 1000);
        console.log("Final total seconds passed: " + elapsedTime);
    }
);

