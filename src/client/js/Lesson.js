'use strict';
var _ = require('lodash');
var Note = require('./Note.js');
var Interval = require('./Interval.js');
var Caption = require('./Caption.js');
var CaptionDurationError = require('./customErrors').CaptionsTooLongError;


function Lesson (options_param) {

    this.options = _.defaults(options_param || {}, {});

    var that = this;
    this.title = 'Untitled';
    this.notes = [];
    this.intervals = [];
    this.captions = [];
    var totalCaptionDurationInMeasures = 0;
    this.bpm = 120;
    this.tempo = 4; // beats per measure
    this.durationInMeasures = 0;
    this.durationInMilliseconds = 0;
    this.smallestNoteSize = null;
    this.lowestNote = null;
    this.highestNote = null;

    function _getDenominator(duration){
        return duration.split('/')[1];
    }

    function _getNumerator(duration){
        return duration.split('/')[0];
    }

    this._getHighestDenominator = function(objList) {
        var highestDenom = 0;
        var currentDenom;
        for (var i = 0; i < objList.length; i++) {
            currentDenom = Number(_getDenominator(objList[i].duration));
            if (currentDenom > highestDenom) {highestDenom = currentDenom;}
        }
        return highestDenom;
    };

    this._sumNumeratorToHighestDenominator = function(duration, highestDenom) {
        var numerator = _getNumerator(duration);
        var denominator = _getDenominator(duration);
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
        var noteDuration;
        for (var i = 0; i < newNotes.length; i++) {
            if (newNotes[i].constructor === Array){
                name = newNotes[i][0];
                noteDuration = newNotes[i][1];
            }
            else if (typeof newNotes[i].name !== 'undefined'){
                name = newNotes[i].name;
                noteDuration = newNotes[i].duration;
            }
            newNoteObj = new Note(name, noteDuration);
            newNoteObj.durationInMeasures = _getObjDurationInMeasures(newNoteObj);
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

    var _getObjDurationInMeasures = function (obj){
        /**
        Whenever notes are added the note is made aware of how long it
         is relative to the duration of a measure. eg 2 is == 2 measures
         */
        var num = _getNumerator(obj.duration);
        var den = _getDenominator(obj.duration);
        return (num / den);
    };

    this._updateNotesWithDurationInMilliseconds = function(){
        for (var i = 0; i < that.notes.length; i++) {
            var lMs = that.notes[i].durationInMeasures * (that.durationInMilliseconds / that.durationInMeasures);
            that.notes[i].durationInMilliseconds = lMs;
        }
    };

    this._updateNotesWithPctCompleteAtNotesEnd = function (){
        var lessonDuration = that.durationInMeasures;
        var priorCombinedDuration = 0;
        for (var i = 0; i < that.notes.length; i++){
            var combinedDurationAtNotesEnd = that.notes[i].durationInMeasures + priorCombinedDuration;
            that.notes[i].percentOnComplete = combinedDurationAtNotesEnd / lessonDuration;
            priorCombinedDuration += that.notes[i].durationInMeasures;
        }
    };

    function _updateSmallestNoteSize(){
        that.smallestNoteSize = that.durationInMeasures;
        for (var i = 0; i < that.notes.length; i++) {
            if (that.notes[i].durationInMeasures < that.smallestNoteSize) {
                that.smallestNoteSize = that.notes[i].durationInMeasures;
            }
        }
    }

    this.addNotes = function(newNotes) {
        var noteObjArr = this._createListOfNoteObjects(newNotes);
        this.notes = this.notes.concat(noteObjArr);
        _updateLessonDuration();
        this.intervals = _updateIntervals(this.notes);
        this._updateNotesWithRelativeInterval();
        this._updateNotesWithPctCompleteAtNotesEnd();
        this._updateNotesWithDurationInMilliseconds();
        _updateSmallestNoteSize();
    };

    this.addCaptions = function(newCaptions) {
        var text;
        var duration;
        for (var idx = 0; idx < newCaptions.length; idx++) {
            if (newCaptions[idx].constructor === Array){
                text = newCaptions[idx][0];
                duration = newCaptions[idx][1];
            }
            else if (typeof newCaptions[idx].text !== 'undefined'){
                text = newCaptions[idx].text;
                duration = newCaptions[idx].duration;
            }
            var newCaptionObj = new Caption(text, duration);
            newCaptionObj.durationInMeasures = _getObjDurationInMeasures(newCaptionObj);
            totalCaptionDurationInMeasures += newCaptionObj.durationInMeasures;
            if (totalCaptionDurationInMeasures > this.durationInMeasures) {
                throw new CaptionDurationError('Combined duration of captions "' + totalCaptionDurationInMeasures +
                    '" cannot exceed the lesson duration "' + this.durationInMeasures + '".');
            }
            this.captions.push(newCaptionObj);
        }
    };

    var _updateLessonDuration = function () {
        var arrayOfNotes = that.notes;
        var highestDenom = that._getHighestDenominator(arrayOfNotes);
        var numerator = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var noteDuration = arrayOfNotes[i].duration;
            // TODO handle odd time signatures eg. 5/7 and find common denominator
            numerator += that._sumNumeratorToHighestDenominator(noteDuration, highestDenom);
        }
        that.durationInMeasures =  numerator / highestDenom;
        _updateDurationInMilliseconds();
    };

    var _updateDurationInMilliseconds = function () {
        var beatCount = that.durationInMeasures * that.tempo;
        var minute = 60000;
        that.durationInMilliseconds = beatCount * (minute / that.bpm);
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
        _updateDurationInMilliseconds();
        this._updateNotesWithDurationInMilliseconds();
    }

    if (typeof this.options.title !== 'undefined') {
        this.title = this.options.title;
    }
}

module.exports = Lesson;