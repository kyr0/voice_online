/**
 * Adapted from James Edwards article here: http://www.sitepoint.com/creating-accurate-timers-in-javascript/
 */

var startTime = Date.now();
var interval = 500;
var elapsedTime = 0;
var c = 1;


function doTimer(length, resolution, oninstance, oncomplete)
{
    var steps = (length / 100) * (resolution / 10),
        speed = length / steps,
        count = 0,
        start = new Date().getTime();

    function instance()
    {
        if(count++ == steps)
        {
            oncomplete(steps, count);
        }
        else
        {
            oninstance(steps, count);

            var diff = (new Date().getTime() - start) - (count * speed);
            //window.setTimeout(instance, (speed - diff));
            setTimeout(instance, (speed - diff));
        }
    }

    //window.setTimeout(instance, speed);
    setTimeout(instance, speed);
}


doTimer(8000, 2, function(steps)
    {
        elapsedTime = ((Date.now() - startTime) / 1000);
        console.log("Total seconds passed: " + elapsedTime + "\n" +
            "Beat #" + c + "\n");
        c = c+1;
    },
    function()
    {
        elapsedTime = ((Date.now() - startTime) / 1000);
        console.log("Final total seconds passed: " + elapsedTime);
    });

