var MPM = require("../../../src/client/js/MPM.js");
var Note = require("../../../src/client/js/Note.js");
var Lesson = require("../../../src/client/js/Lesson.js");
var User = require("../../../src/client/js/User.js");
var LessonPlayer = require("../../../src/client/js/LessonPlayer.js");

// these window assignments must be done outside of onLoad
// for sharing with paper.js in case they are accessed before load
window.percentComplete = 0;
window.pitchFreq = -1;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var bufferLength = 1024;
var scriptNode = null;
window.oscillator = null;
var mediaStreamSource = null;
var mpm = null;
var lastResult = null;

var lessons = [];
lessons.push(new Lesson([["A2", "1"], ["B2", "1"], ["G2", "7/8"], ["A2", "2/4"]]));
lessons.push(new Lesson([["A2", "2"], ["B2", "1/2"], ["G2", "3/8"], ["A2", "2/4"],["Ab2", "1/4"]]));
lessons.push(new Lesson([["A2", "1"], ["B2", "3"], ["G2", "1/4"]]));

var users = [];
users.push(new User("A1", "F3"));  // anything lower than A1 will == -1 pitch

window.lPlayer = new LessonPlayer(users[0], lessons[0]);


window.onload = function() {
    audioContext = new AudioContext();
    window.oscillator = audioContext.createOscillator();
    window.oscillator.frequency.value = lPlayer.getCurrentSet().notes[0].frequency;  // osc start frequency
    mpm = new MPM(audioContext.sampleRate, bufferLength);
    scriptNode = audioContext.createScriptProcessor(bufferLength, 1, 1);


    // use the oscillator
    window.oscillator.connect(scriptNode); // Connect output of Oscillator to our scriptNode
    window.oscillator.start();

    // get the mic
    //getUserMedia(
    //    {
    //        "audio": {
    //            "mandatory": {
    //                "googEchoCancellation": "false",
    //                "googAutoGainControl": "false",
    //                "googNoiseSuppression": "false",
    //                "googHighpassFilter": "false"
    //            },
    //            "optional": []
    //        }
    //    }, gotStream
    //);

    window.lPlayer.start();

    // When the buffer is full of frames this event is executed
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // TODO fix the transition detection errors by averaging frames
        //console.log("OnAudioProcess");
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var inputData = inputBuffer.getChannelData(0);
        updatePitch(inputData);
    };
    //console.log(scriptNode
    //    + "target: " + scriptNode.target
    //    + "\ntype: " + scriptNode.type
    //    + "\nbubbles?: " + scriptNode.bubbles
    //    + "\ncancelable?:" + scriptNode.cancelable
    //    + "\nplaybackTime: " + scriptNode.playbackTime);
};

function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect stream to the destination.
    mediaStreamSource.connect( scriptNode );

}



function updatePitch(buf) {
    var resultObj = mpm.detectPitch(buf);
    var pitchFreq = resultObj.getPitchFrequency();
    var probability = resultObj.getProbability();
    if (pitchFreq === -1 || probability < .95) {
        lastResult = -1;
    }
    else {
        var noteObj =  new Note(pitchFreq);
        var noteName = noteObj.name;
        var curChart = lPlayer.getCurrentChart();
        var relativeItvl = curChart[noteName] + 1;
        if (relativeItvl){
            var detuneAmt = noteObj.getCentsDiff(pitchFreq);
            window.pitchYAxisRatio = relativeItvl + (detuneAmt / 100);
        }
        else {
            window.pitchYAxisRatio = null;
        }
        lastResult = 1;
    }
}