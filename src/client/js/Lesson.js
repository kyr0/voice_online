'use strict';
var _ = require('lodash');
var Note = require('./Note.js');
var Interval = require('./Interval.js');
var Caption = require('./Caption.js');
var CaptionDurationError = require('./customErrors').CaptionsTooLongError;

// TODO this shit is ugly, let's refactor, exporting so many unnecessary functions for testing via `this`
function Lesson(options_param) {

    var that = this;
    this.title = 'Untitled';
    this.noteList = [];
    this.intervals = [];
    this.captionList = [];
    this.chart = {};
    var totalCaptionDurationInMeasures = 0;
    this.bpm = 120;
    this.tempo = 4; // beats per measure
    this.durationInMeasures = 0;
    this.durationInMilliseconds = 0;
    this.introLengthInMeasures = 1;
    this.smallestNoteSize = null;
    this.lowestNote = null;
    this.highestNote = null;


    function _getDenominator(duration){
        return duration.split('/')[1];
    }


    function _getNumerator(duration){
        return duration.split('/')[0];
    }


    this._getLowestCommonMultiple = function (objList) {
        function gcd(a, b) {
            return !b ? a : gcd(b, a % b);
        }

        function lcm(a, b) {
            return (a * b) / gcd(a, b);
        }

        var currentDenom;
        var curLCM = 1;

        for (var i = 0; i < objList.length; i++) {
            currentDenom = Number(_getDenominator(objList[i].duration));
            curLCM = lcm(curLCM, currentDenom);
        }
        return curLCM;
    };


    this._sumNumeratorToLowestCommonMultiple = function (duration, lcm) {
        var numerator = _getNumerator(duration);
        var denominator = _getDenominator(duration);
        var multiple;

        if (denominator !== lcm) {
            multiple = lcm / denominator;
        }
        return Number(numerator * multiple);
    };


    function _setRangeDelimiters(noteObj) {
        if (noteObj.name === '-') {
            return;
        }

        if (that.lowestNote === null) {
            that.lowestNote = noteObj;
        }
        if (that.highestNote === null) {
            that.highestNote = noteObj;
        }
        if (noteObj.frequency < that.lowestNote.frequency) {
            that.lowestNote = noteObj;
        }
        else if (noteObj.frequency > that.highestNote.frequency) {
            that.highestNote = noteObj;
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
        if (this.highestNote) {
            for (var i = 0; i < this.noteList.length; i++) {
                var itvl = new Interval(this.noteList[i].name, this.highestNote.name);
                this.noteList[i].relativeInterval = itvl.halfsteps;
            }
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
        for (var i = 0; i < that.noteList.length; i++) {
            var lMs = that.noteList[i].durationInMeasures * (that.durationInMilliseconds / that.durationInMeasures);
            that.noteList[i].durationInMilliseconds = lMs;
        }
    };


    this._updateNotesWithElapsedTimeAtNotesEnd = function (){
        var priorCombinedDuration = 0;
        for (var i = 0; i < that.noteList.length; i++){
            that.noteList[i].elapsedTimeAtNotesEnd = that.noteList[i].durationInMilliseconds + priorCombinedDuration;
            priorCombinedDuration += that.noteList[i].durationInMilliseconds;
        }
    };


    function _updateSmallestNoteSize(){
        that.smallestNoteSize = that.durationInMeasures;
        for (var i = 0; i < that.noteList.length; i++) {
            if (that.noteList[i].durationInMeasures < that.smallestNoteSize) {
                that.smallestNoteSize = that.noteList[i].durationInMeasures;
            }
        }
    }

    function _generateChart() {
        // Generates the chart for each set in exercise.
        // A chart basically allows us to tell where the indicator should appear
        //  on the canvas to represent the user's current pitch.
        var note = that.lowestNote;
        var range = that.getLessonRange();
        for (var step = 0; step < range + 1; step++){
            that.chart[note.name] = note.getDistanceToNote(that.highestNote.name);
            note = note.getNextNote();
        }
    }

    this.addNotes = function (newNotes) {
        var noteObjArr = this._createListOfNoteObjects(newNotes);
        Array.prototype.push.apply(this.noteList, noteObjArr);
        _updateLessonDuration();
        this.intervals = _updateIntervals(this.noteList);
        this._updateNotesWithRelativeInterval();
        this._updateNotesWithDurationInMilliseconds();
        this._updateNotesWithElapsedTimeAtNotesEnd();
        _updateSmallestNoteSize();
        _generateChart();
    };


    this.addCaptions = function (newCaptions) {
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
            this.captionList.push(newCaptionObj);
        }
    };


    var _updateLessonDuration = function () {
        var arrayOfNotes = that.noteList;
        var lcm = that._getLowestCommonMultiple(arrayOfNotes);
        var numerator = 0;
        for (var i = 0; i < arrayOfNotes.length; i++) {
            var noteDuration = arrayOfNotes[i].duration;
            numerator += that._sumNumeratorToLowestCommonMultiple(noteDuration, lcm);
        }
        that.durationInMeasures =  numerator / lcm;
        _updateDurationInMilliseconds();
    };


    var _updateDurationInMilliseconds = function () {
        var beatCount = that.durationInMeasures * that.tempo;
        that.durationInMilliseconds = beatCount * (60000 / that.bpm);
    };


    this.getLessonRange = function () {
        if (this.lowestNote && this.highestNote) {
            var range = new Interval(this.lowestNote.name, this.highestNote.name);
            return range.halfsteps;
        }
    };


    if (options_param) {
        // bpm should appear above note/caption lists for duration measurements
        if (options_param.bpm) {
            this.bpm = options_param.bpm;
        }

        if (options_param.noteList) {
            this.addNotes(options_param.noteList);
        }

        if (options_param.captionList) {
            this.addCaptions(options_param.captionList);
        }

        if (options_param.title) {
            this.title = options_param.title;
        }
    }
}

module.exports = Lesson;