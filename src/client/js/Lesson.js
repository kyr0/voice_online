'use strict';
var _ = require('lodash');
var Note = require('./Note.js');
var Interval = require('./Interval.js');

function Lesson (options_param) {

    var options = _.defaults(options_param || {}, {});

    var that = this;
    this.notes = [];
    this.intervals = [];
    this.bpm = 120;
    this.tempo = 4; // beats per measure
    this.lengthInMeasures = 0;
    this.lengthInMilliseconds = 0;
    this.smallestNoteSize = null;
    this.lowestNote = null;
    this.highestNote = null;

    function _getDenominator(noteLength){
        return noteLength.split('/')[1];
    }

    function _getNumerator(noteLength){
        return noteLength.split('/')[0];
    }

    this._getHighestDenominator = function(arrayOfNotes) {
        var highestDenom = 0;
        var currentDenom;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            currentDenom = Number(_getDenominator(arrayOfNotes[i].noteLength));
            if (currentDenom > highestDenom) {highestDenom = currentDenom;}
        }
        return highestDenom;
    };

    this._sumNumeratorToHighestDenominator = function(noteLength, highestDenom) {
        var numerator = _getNumerator(noteLength);
        var denominator = _getDenominator(noteLength);
        while (denominator < highestDenom) {
            numerator *= 2;
            denominator *= 2;
        }
        return Number(numerator);
    };

    function _setRangeDelimiters(note) {
        if (note.name === '-') {
            return;
        }

        if (that.lowestNote === null) {
            that.lowestNote = note;
        }
        if (that.highestNote === null) {
            that.highestNote = note;
        }
        if (note.frequency < that.lowestNote.frequency) {
            that.lowestNote = note;
        }
        else if (note.frequency > that.highestNote.frequency) {
            that.highestNote = note;
        }
    }

    this._createListOfNoteObjects = function (newNotes) {
        var noteObjArr = [];
        var name;
        var newNoteObj;
        var noteLength;
        for (var i = 0; i < newNotes.length; i++) {
            if (newNotes[i].constructor === Array){
                name = newNotes[i][0];
                noteLength = newNotes[i][1];
            }
            else if (typeof newNotes[i].name !== 'undefined'){
                name = newNotes[i].name;
                noteLength = newNotes[i].noteLength;
            }
            newNoteObj = new Note(name, noteLength);
            newNoteObj.lengthInMeasures = _getNoteLengthInMeasures(newNoteObj);
            noteObjArr.push(newNoteObj);
            _setRangeDelimiters(newNoteObj);
        }
        return noteObjArr;
    };

    var _makeInterval = function(startNote, endNote) {
        var itvl = null;
        try {
            itvl = new Interval(startNote, endNote);
        }
        catch (e) {
            if (e.name === 'SilentIntervalError') {
                return null;
            }
            else {
                throw e; // let other errors bubble up
            }
        }
        return itvl;
    };

    var _updateIntervals = function(noteArr){
        var itvlObjArr = [];
        for (var i = 0; i < noteArr.length - 1; i++) {
            var startNote = noteArr[i].name;
            var endNote = noteArr[i + 1].name;
            itvlObjArr.push(_makeInterval(startNote, endNote));
        }
        return itvlObjArr;
    };

    this._updateNotesWithRelativeInterval = function (){
        /**
        Whenever notes are added the Note is made aware of how far away it
        is from the highest note in the lesson.
         */
        for (var i = 0; i < this.notes.length; i++) {
            var itvl = _makeInterval(this.notes[i].name, this.highestNote.name);
            var intervalSteps = null;
            if (itvl) {
                intervalSteps =_makeInterval(this.notes[i].name, this.highestNote.name).halfsteps;
            }
            this.notes[i].relativeInterval = intervalSteps;
        }
    };

    var _getNoteLengthInMeasures = function (noteObj){
        /**
        Whenever notes are added the note is made aware of how long it
         is relative to the length of a measure. eg 2 is == 2 measures
         */
        var num = _getNumerator(noteObj.noteLength);
        var den = _getDenominator(noteObj.noteLength);
        return (num / den);
    };

    this._updateNotesWithLengthInMilliseconds = function(){
        for (var i = 0; i < that.notes.length; i++) {
            var lMs = that.notes[i].lengthInMeasures * (that.lengthInMilliseconds / that.lengthInMeasures);
            that.notes[i].lengthInMilliseconds = lMs;
        }
    };

    this._updateNotesWithPctCompleteAtNotesEnd = function (){
        var lessonLength = that.lengthInMeasures;
        var priorCombinedLength = 0;
        for (var i = 0; i < that.notes.length; i++){
            var combinedLengthAtNotesEnd = that.notes[i].lengthInMeasures + priorCombinedLength;
            that.notes[i].percentOnComplete = combinedLengthAtNotesEnd / lessonLength;
            priorCombinedLength += that.notes[i].lengthInMeasures;
        }
    };

    function _updateSmallestNoteSize(){
        that.smallestNoteSize = that.lengthInMeasures;
        for (var i = 0; i < that.notes.length; i++) {
            if (that.notes[i].lengthInMeasures < that.smallestNoteSize) {
                that.smallestNoteSize = that.notes[i].lengthInMeasures;
            }
        }
    }

    this.addNotes = function(newNotes) {
        var noteObjArr = this._createListOfNoteObjects(newNotes);
        this.notes = this.notes.concat(noteObjArr);
        _updateLessonLength();
        this.intervals = _updateIntervals(this.notes);
        this._updateNotesWithRelativeInterval();
        this._updateNotesWithPctCompleteAtNotesEnd();
        this._updateNotesWithLengthInMilliseconds();
        _updateSmallestNoteSize();
    };

    var _updateLessonLength = function () {
        var arrayOfNotes = that.notes;
        var highestDenom = that._getHighestDenominator(arrayOfNotes);
        var numerator = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var noteLength = arrayOfNotes[i].noteLength;
            // TODO handle odd time signatures eg. 5/7 and find common denominator
            numerator += that._sumNumeratorToHighestDenominator(noteLength, highestDenom);
        }
        that.lengthInMeasures =  numerator / highestDenom;
        var beatCount = that.lengthInMeasures * that.tempo;
        var minute = 60000;
        that.lengthInMilliseconds = beatCount * (minute / that.bpm);
    };

    this.getLessonRange = function() {
        var range = new Interval(this.lowestNote.name, this.highestNote.name);
        return range.halfsteps;
    };

    if (typeof options.noteList !== 'undefined') {
        this.addNotes(options.noteList);
    }

}

module.exports = Lesson;