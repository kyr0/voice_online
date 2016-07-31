"use strict";


/*
 * This private singleton-esque object creates the following:
 *
 * 1) a linked list of Note objects, each Note is
 * aware of its musical neighbours a semitone up and a semitone down and contains a reference to each.
 * Each note also is aware of its frequency.
 *
 * 2) an array with all available frequencies, used in root-finding algorithm
 *
 * 3) a convenient reverse map which returns the note name based on frequency, allows reconnecting to
 *  the pitchMap with a trivial lookup.
 */
function NoteMaps() {

    // the raw data used to generate the stuff
    // TODO make sharps a possible choice
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

    this.pitchMap = {};
    this.pitchArray = []; // when we need index for quick lookups
    this.reverseMap = {}; // makes it simple to take results from Array back into Map

    this.validateNoteName = function(noteName) {
        try {
            if (typeof this.pitchMap[noteName].name !== 'undefined') {
                return this.pitchMap[noteName].name;
            }
        }
        catch (err) {
            throw new Error ("validateNoteName(): the supplied note name is invalid - " + noteName);
        }
    };

    // will loop through all notes and create the maps, arrays etc
    for (var octave = 0; octave < _notes2D.length; octave++) {
        for (var note = 0; note < _notes2D[octave].length; note++) {
            var thisNotesName = _noteNames[note] + octave; // symbolic note eg "Ab4"
            var thisNotesFreq = _notes2D[octave][note];

            // pitch map is for convenient-yet-slow lookups
            this.pitchMap[thisNotesName] = {
                name : thisNotesName,
                index : note + (12 * octave),
                frequency : thisNotesFreq,
                previousNote : getPreviousNote(octave, note, this.pitchMap),
                nextNote : null
            };
            // Essentially this finds the nextNote property of the previous note and assigns it
            //   a reference to a note object (current)
            if (!(octave === 0 && note === 0)) { // don't need to set the note before C0
                var prevNoteNum = (note === 0) ? 11 : note - 1;
                var prevOctave = (prevNoteNum === 11) ? octave - 1 : octave;
                //var nextNoteNum = (note === 11) ? 0 : note + 1;
                //var nextOctave = (nextNoteNum === 0) ? octave + 1 : octave;
                this.pitchMap[_noteNames[prevNoteNum] + prevOctave].nextNote = this.pitchMap[_noteNames[note] + octave];
            }

            // pitchArray is used with root-finding algorithm Brent's Method (arrays are fast)
            this.pitchArray.push(this.pitchMap[thisNotesName]);

            // use the frequency from pitchArray[x] to get the name for Note objects in pitchMap
            this.reverseMap[thisNotesFreq] = {
                name : thisNotesName
            };


        }
    }

    // returns a reference to the previous note object
    function getPreviousNote (curOctave, curNoteNum, pitchMap){
        if (curOctave === 0 && curNoteNum === 0) return null;
        var prevNoteNum = (curNoteNum === 0) ? 11 : curNoteNum - 1;
        var prevOctave = (prevNoteNum === 11) ? curOctave - 1 : curOctave;
        return pitchMap[_noteNames[prevNoteNum] + prevOctave];
    }

    // take a raw frequency and returns the on-key frequency of the nearest musical note
    // Note: this is faster than the getClosestNoteFromPitch method on the Note object
    this.getClosestFreqFromPitch = function(frequency){
        var noteNum = 12 * (Math.log(frequency / 440)/Math.log(2) );
        return this.pitchArray[Math.round(noteNum) + 57].frequency;
    };

}

module.exports = NoteMaps;