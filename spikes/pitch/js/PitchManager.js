/*
 *  Adapted from the TarsosDsP Java library for use in Javascript
 *
 */

var PitchManager = (function() {


    var pitchMap = new _PitchMap();
    var lowThreshold = pitchMap.C0.frequency;
    var highThreshold = pitchMap.B8.frequency;

    // returns the difference from expected pitch, rounded to the nearest cent
    var publicGetCentsDiff = function(actualPitch, noteName){
        if (actualPitch < lowThreshold || actualPitch > highThreshold) {
            throw new Error("getCentsDiff(): the frequency is outside the threshold - Fq:" + actualPitch);
        }
        var expectedPitch = pitchMap[noteName].frequency;
        if (actualPitch < expectedPitch) {  // flat
            var semitoneDownPitch = pitchMap[noteName]['previousNote']['frequency'];
            if (actualPitch <= semitoneDownPitch) return null; // more than one semitone difference
            else return Math.round((expectedPitch - actualPitch) / ((semitoneDownPitch - expectedPitch) / 100));
        }
        else if (actualPitch > expectedPitch) { // sharp
            var semitoneUpPitch = pitchMap[noteName]['nextNote']['frequency'];
            if (actualPitch >= semitoneUpPitch) return null; // more than one semitone difference
            else return Math.round((actualPitch - expectedPitch) / ((semitoneUpPitch - expectedPitch) / 100));
        }
        else return 0; // perfect pitch, worth noting the above may return 0 if Math.round determines
    };

    var publicGetNote = function(noteName){
        return pitchMap[noteName];
    };

    //var getCentsUp
    //var getSemitoneInterval


    return {
        getCentsDiff : publicGetCentsDiff,
        getNote : publicGetNote,
    };

})();

module.exports = PitchManager;


// This private singleton object creates a linked list of Note objects, each Note is
// aware of its musical neighbours a semitone up and a semitone down and contains a reference to each.
// Each note also is aware of its frequency.
function _PitchMap() {

    // the raw data used to generate the map
    var _noteNames = ["C", "Db",    "D",   "Eb",    "E",    "F",   "Gb",    "G",   "Ab",    "A",   "Bb",    "B"];
    var _oct0 = [16.352, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125, 24.500, 25.957, 27.500, 29.135, 30.868];
    var _oct1 = [32.703, 34.648, 36.708, 38.891, 41.203, 43.653, 46.249, 48.999, 51.913, 55.000, 58.270, 61.735];
    var _oct2 = [65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.83, 110.00, 116.54, 123.47];
    var _oct3 = [130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94];
    var _oct4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
    var _oct5 = [523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77];
    var _oct6 = [1046.5, 1108.7, 1174.7, 1244.5, 1318.5, 1396.9, 1480.0, 1568.0, 1661.2, 1760.0, 1864.7, 1975.5];
    var _oct7 = [2093.0, 2217.5, 2349.3, 2489.0, 2637.0, 2793.8, 2960.0, 3136.0, 3322.4, 3520.0, 3729.3, 3951.1];
    var _oct8 = [4186.0, 4434.9, 4698.6, 4978.0, 5274.0, 5587.7, 5919.9, 6271.9, 6644.9, 7040.0, 7458.6, 7902.1];

    var _notes2D = [_oct0, _oct1, _oct2, _oct3, _oct4, _oct5, _oct6, _oct7, _oct8]; // 2D array

    var pitchMap = {};

    // will loop through all notes and create the map
    for (var octave = 0; octave < _notes2D.length; octave++) {
        for (var note = 0; note < _notes2D[octave].length; note++) {
            pitchMap[_noteNames[note] + octave] = {
                name : _noteNames[note] + octave,
                frequency : _notes2D[octave][note],
                previousNote : getPreviousNote(octave, note),
                //nextNote : getNextNote(octave, note)
                nextNote : null
            };
            setNextNoteOnPrevious(octave, note);  // link previous note after creating this one
        }
    }

    // returns a reference to the previous note object
    function getPreviousNote (curOctave, curNoteNum){
        if (curOctave === 0 && curNoteNum === 0) return null;
        var prevNoteNum = (curNoteNum === 0) ? 11 : curNoteNum - 1;
        var prevOctave = (prevNoteNum === 11) ? curOctave - 1 : curOctave;
        return pitchMap[_noteNames[prevNoteNum] + prevOctave];
    }

    //function getNextNote (curOctave, curNoteNum){
    //    if (curOctave === 8 && curNoteNum === 11) return null;
    //    var nextNoteNum = (curNoteNum === 11) ? 0 : curNoteNum + 1;
    //    var nextOctave = (nextNoteNum === 0) ? curOctave + 1 : curOctave;
    //    return _noteNames[nextNoteNum] + nextOctave;
    //}
    //

    // Square bracket notation for the win :(
    // Essentially this finds the nextNote property of the previous note and assigns it
    //   a reference to a note object (current)
    function setNextNoteOnPrevious (curOctave, curNoteNum){
        if (curOctave === 0 && curNoteNum === 0) return; // don't need to set the note before C0
        var prevNoteNum = (curNoteNum === 0) ? 11 : curNoteNum - 1;
        var prevOctave = (prevNoteNum === 11) ? curOctave - 1 : curOctave;
        //var nextNoteNum = (curNoteNum === 11) ? 0 : curNoteNum + 1;
        //var nextOctave = (nextNoteNum === 0) ? curOctave + 1 : curOctave;
        pitchMap[_noteNames[prevNoteNum] + prevOctave]['nextNote'] = pitchMap[_noteNames[curNoteNum] + curOctave];
    }

    return pitchMap;
}

