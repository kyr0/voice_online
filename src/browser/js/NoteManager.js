"use strict";

var Note = require("./Note.js");
var NoteMaps = require("./NoteMaps.js");

var NoteManager = (function() {

    var _nMaps = new NoteMaps();
    var _pitchMap = _nMaps.pitchMap;
    var _pitchArray = _nMaps.pitchArray;
    var _reverseMap = _nMaps.reverseMap;

    var lowThreshold = _pitchMap.C0.frequency;
    var highThreshold = _pitchMap.B8.frequency;

    // take a raw frequency and returns the frequency of the nearest musical note
    // thanks to Chris Wilson for most of this function
    var publicGetClosestFreqFromPitch = function(frequency){
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return _pitchArray[Math.round( noteNum ) + 57];
    };

    // takes a raw frequency and returns the Object of the nearest musical note
    var publicGetClosestNoteNameFromPitch = function(frequency){
        var noteName = _reverseMap[publicGetClosestFreqFromPitch(frequency)].name;
        return _pitchMap[noteName].name;
    };

    // actualPitch is a float representing the incoming frequency
    // expected is either a float representing a musical note, or a string represenation eg 'A1'
    //   returns the difference from expected pitch, rounded to the nearest cent
    var publicGetCentsDiff = function(actualPitch, expectedPitchOrNoteName){
        var expectedFreq = expectedPitchOrNoteName;
        if (typeof expectedFreq === 'string') {
            expectedFreq = _pitchMap[expectedPitchOrNoteName].frequency;
        }

        if (actualPitch < lowThreshold || actualPitch > highThreshold) {
            throw new Error("getCentsDiff(): the frequency is outside the threshold - Fq:" + actualPitch);
        }

        // thanks again to Chris Wilson for the logarithmic cent finding algorithm below
        // Minor adjustments: Math.round instead of Math.floor allows pitch within .5 cent of
        //  intended note to be counted as "perfect"
        var centsOff =  Math.round( 1200 * Math.log( actualPitch / expectedFreq )/Math.log(2) );

        // Don't return a value if more than .5 semitone off target
        if (Math.abs(centsOff) > 50) {
            return null;
        }
        return centsOff;
    };

    var publicGetNoteMapAtName = function(name) {
        return _pitchMap[name];
    };


    return {
        getClosestFreqFromPitch : publicGetClosestFreqFromPitch,
        getClosestNoteNameFromPitch : publicGetClosestNoteNameFromPitch,
        getCentsDiff : publicGetCentsDiff,
        getNoteMapAtName : publicGetNoteMapAtName
    };

})();

module.exports = NoteManager;

