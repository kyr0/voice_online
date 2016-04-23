'use strict';
var _ = require('lodash');
var Note = require('./Note.js');
var Interval = require('./Interval.js');
var Caption = require('./Caption.js');
var CaptionLengthError = require('./customErrors').CaptionsTooLongError;


function Lesson (options_param) {

    this.options = _.defaults(options_param || {}, {});

    var that = this;
    this.title = 'Untitled';
    this.notes = [];
    this.intervals = [];
    this.captions = [];
    var totalCaptionLengthInMeasures = 0;
    this.bpm = 120;
    this.tempo = 4; // beats per measure
    this.lengthInMeasures = 0;
    this.lengthInMilliseconds = 0;
    this.smallestNoteSize = null;
    this.lowestNote = null;
    this.highestNote = null;

    function _getDenominator(length){
        return length.split('/')[1];
    }

    function _getNumerator(length){
        return length.split('/')[0];
    }

    this._getHighestDenominator = function(objList) {
        var highestDenom = 0;
        var currentDenom;
        for (var i = 0; i < objList.length; i++) {
            currentDenom = Number(_getDenominator(objList[i].length));
            if (currentDenom > highestDenom) {highestDenom = currentDenom;}
        }
        return highestDenom;
    };

    this._sumNumeratorToHighestDenominator = function(length, highestDenom) {
        var numerator = _getNumerator(length);
        var denominator = _getDenominator(length);
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
                noteLength = newNotes[i].length;
            }
            newNoteObj = new Note(name, noteLength);
            newNoteObj.lengthInMeasures = _getObjLengthInMeasures(newNoteObj);
            noteObjArr.push(newNoteObj);
            _setRangeDelimiters(newNoteObj);
        }
        return noteObjArr;
    };

    var _updateIntervals = function(noteArr){
        var itvlObjArr = [];
        for (var i = 0; i < noteArr.length - 1; i++) {
            var startNote = noteArr[i].name;
            var endNote = noteArr[i + 1].name;
            itvlObjArr.push(new Interval(startNote, endNote));
        }
        return itvlObjArr;
    };

    this._updateNotesWithRelativeInterval = function (){
        /**
        Whenever notes are added the Note is made aware of how far away it
        is from the highest note in the lesson.
         */
        for (var i = 0; i < this.notes.length; i++) {
            var itvl = new Interval(this.notes[i].name, this.highestNote.name);
            this.notes[i].relativeInterval = itvl.halfsteps;
        }
    };

    var _getObjLengthInMeasures = function (obj){
        /**
        Whenever notes are added the note is made aware of how long it
         is relative to the length of a measure. eg 2 is == 2 measures
         */
        var num = _getNumerator(obj.length);
        var den = _getDenominator(obj.length);
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

    this.addCaptions = function(newCaptions) {
        for (var idx = 0; idx < newCaptions.length; idx++) {
            var text = newCaptions[idx][0];
            var length = newCaptions[idx][1];
            var newCaptionObj = new Caption(text, length);
            newCaptionObj.lengthInMeasures = _getObjLengthInMeasures(newCaptionObj);
            totalCaptionLengthInMeasures += newCaptionObj.lengthInMeasures;
            if (totalCaptionLengthInMeasures > this.lengthInMeasures) {
                throw new CaptionLengthError('Combined length of captions "' + totalCaptionLengthInMeasures +
                    '" cannot exceed the lesson length "' + this.lengthInMeasures + '".');
            }
            this.captions.push(newCaptionObj);
        }
    };

    var _updateLessonLength = function () {
        var arrayOfNotes = that.notes;
        var highestDenom = that._getHighestDenominator(arrayOfNotes);
        var numerator = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var noteLength = arrayOfNotes[i].length;
            // TODO handle odd time signatures eg. 5/7 and find common denominator
            numerator += that._sumNumeratorToHighestDenominator(noteLength, highestDenom);
        }
        that.lengthInMeasures =  numerator / highestDenom;
        _updateLengthInMilliseconds();
    };

    var _updateLengthInMilliseconds = function () {
        var beatCount = that.lengthInMeasures * that.tempo;
        var minute = 60000;
        that.lengthInMilliseconds = beatCount * (minute / that.bpm);
    };

    this.getLessonRange = function() {
        var range = new Interval(this.lowestNote.name, this.highestNote.name);
        return range.halfsteps;
    };

    if (typeof this.options.noteList !== 'undefined') {
        this.addNotes(this.options.noteList);
    }

    if (typeof this.options.captionList !== 'undefined') {
        this.addCaptions(this.options.captionList);
    }

    if (typeof this.options.bpm !== 'undefined') {
        this.bpm = this.options.bpm;
        _updateLengthInMilliseconds();
        this._updateNotesWithLengthInMilliseconds();
    }

    if (typeof this.options.title !== 'undefined') {
        this.title = this.options.title;
    }
}

module.exports = Lesson;