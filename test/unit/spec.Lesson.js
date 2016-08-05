'use strict';

var Lesson = require('../../src/client/js/Lesson.js');
var Interval = require('../../src/client/js/Interval.js');
var CaptionDurationError = require('../../src/client/js/customErrors').CaptionsTooLongError;


describe('Lesson constructor given note list', function() {
    beforeEach(function () {
        var arrayList = [['B2', '1/8'], ['A2', '1/2'], ['B2', '1/4'], ['B2', '1/32']];
        this.lesson = new Lesson({ noteList: arrayList });
    });

    it('should get correct length in measures', function () {
        expect(this.lesson.durationInMeasures).to.equal(0.90625);
    });

    it('should get correct length in milliseconds', function () {
        var beatCount = this.lesson.durationInMeasures * this.lesson.tempo;
        var minute = 60000;
        var expectedMs = beatCount * (minute / this.lesson.bpm);
        expect(this.lesson.durationInMilliseconds).to.equal(expectedMs);
    });

    it('should get correct range', function () {
        expect(this.lesson.getLessonRange()).to.equal(2);
    });

    it('should have the right number of notes', function () {
        expect(this.lesson.noteList.length).to.equal(4);
    });

    it('should have the right number of intervals', function () {
        expect(this.lesson.intervals.length).to.equal(3);
    });
});


describe('Lesson constructor given note list and captions', function() {
    beforeEach(function () {
        var noteList = [['B2', '1/4'], ['A2', '1/4'], ['B2', '1/4'], ['B2', '1/4']];
        var captionList = [['', '1/4'],['Yaw', '1/2']];

        this.lesson = new Lesson({
            noteList: noteList,
            captionList: captionList
        });
    });

    it('should have captions with correct length in measures', function () {
        expect(this.lesson.captionList[0].durationInMeasures).to.equal(0.25);
        expect(this.lesson.captionList[1].durationInMeasures).to.equal(0.5);
    });

    it('should be able to add new captions after initialization', function () {
        this.lesson.addCaptions([['', '1/4']]);
        expect(this.lesson.captionList[2].durationInMeasures).to.equal(0.25);
    });

    it('should throw an error if length of captions exceeds Lesson length', function () {
        var that = this;
        var fn = function(){
            that.lesson.addCaptions([['', '1/3']]);
        };
        expect(fn).to.throw(CaptionDurationError);
    });
});


describe('Lesson constructor given bpm', function() {
    beforeEach(function () {
        var noteList = [['B2', '1/4'], ['A2', '1/4'], ['B2', '1/4'], ['B2', '1/4']];

        this.lesson = new Lesson({
            noteList: noteList,
            bpm: 60
        });
    });

    it('should set correct bpm', function () {
        expect(this.lesson.bpm).to.equal(60);
    });

    it('should have correct length in milliseconds', function () {
        expect(this.lesson.durationInMilliseconds).to.equal(4000);  // 4 beats, 4 seconds, 60bpm
    });

    it('should have correct length in milliseconds for each note', function () {
        expect(this.lesson.noteList[0].durationInMilliseconds).to.equal(1000);  // 1 beats, 1 second, 60bpm
        expect(this.lesson.noteList[1].durationInMilliseconds).to.equal(1000);  // 1 beats, 1 second, 60bpm
        expect(this.lesson.noteList[2].durationInMilliseconds).to.equal(1000);  // 1 beats, 1 second, 60bpm
        expect(this.lesson.noteList[3].durationInMilliseconds).to.equal(1000);  // 1 beats, 1 second, 60bpm
    });

});


describe('Lesson', function() {
    beforeEach(function () {
        this.lesson = new Lesson();
    });

    it('should have default bpm of 120', function () {
        expect(this.lesson.bpm).to.equal(120);
    });

    it('should be able to set its BPM speed', function () {
        this.lesson.bpm = 130;
        expect(this.lesson.bpm).to.equal(130);
    });

    it('_sumNumeratorToHighestDenominator() should retrieve the converted numerator', function () {
        expect(this.lesson._sumNumeratorToHighestDenominator('1/4', 32)).to.equal(8);
    });

    it('smallestNoteSize should return null with no notes in lesson', function () {
        expect(this.lesson.smallestNoteSize).to.be.null;
    });

    describe('with multiple notes', function () {
        beforeEach(function () {
            this.newNotes = [
                {name: 'B2', duration: '3/8'},
                {name: 'A1', duration: '1/2'},
                {name: 'Db3', duration: '1/4'},
                {name: 'B2', duration: '2'}
            ];
            this.lesson.addNotes(this.newNotes);
            this.lesson.addNotes([['B3', '1/16'], ['C4', '1/32']]);
        });

        describe('_updateRelativeIntervals', function () {

            it('should set the relative interval to distance from highest note', function () {
                expect(this.lesson.noteList[0].relativeInterval).to.equal(13);
            });

            it('should show the highest note having distance zero', function () {
                expect(this.lesson.noteList[5].relativeInterval).to.equal(0);
            });

            it('should update when higher notes are added', function () {
                this.lesson.addNotes([['Db4', '1']]);
                expect(this.lesson.noteList[0].relativeInterval).to.equal(14);
            });
        });

        describe('_updateRelativeNoteDurations', function () {

            it('should set the relative duration to a percent of a measure', function () {
                var expectedRelLen = 3 / 8;
                expect(this.lesson.noteList[0].durationInMeasures).to.equal(expectedRelLen);
            });

        });

        it('should always know the combined duration (in measures) of notes contained', function () {
            // 3/8 *4 = 12/32, 1/2 *16 = 16/32, 1/4 *8 = 8/32, 2 = 64/32, 1/16 = 2/32, 1/32
            // 12 + 16 + 8 + 64 + 2 + 1 = 103
            // 103 / 32 (highest denominator) = 3.21875
            var expectedDuration = (3 / 8) + (1 / 2) + (1 / 4) + 2 + (1 / 16) + (1 / 32);
            expect(this.lesson.durationInMeasures).to.equal(expectedDuration);
        });

        it('should have notes which are aware of percentOnComplete ', function () {
            var expectedDuration = (3 / 8) / this.lesson.durationInMeasures;
            expect(this.lesson.noteList[0].percentOnComplete).to.equal(expectedDuration);
            expectedDuration = ((3 / 8) + (1 / 2)) / this.lesson.durationInMeasures;
            expect(this.lesson.noteList[1].percentOnComplete).to.equal(expectedDuration);
            expectedDuration = ((3 / 8) + (1 / 2) + (1 / 4)) / this.lesson.durationInMeasures;
            expect(this.lesson.noteList[2].percentOnComplete).to.equal(expectedDuration);
            expectedDuration = ((3 / 8) + (1 / 2) + (1 / 4) + 2) / this.lesson.durationInMeasures;
            expect(this.lesson.noteList[3].percentOnComplete).to.equal(expectedDuration);
            expectedDuration = ((3 / 8) + (1 / 2) + (1 / 4) + 2 + (1 / 16)) / this.lesson.durationInMeasures;
            expect(this.lesson.noteList[4].percentOnComplete).to.equal(expectedDuration);
            expectedDuration = ((3 / 8) + (1 / 2) + (1 / 4) + 2 + (1 / 16) + (1 / 32)) / this.lesson.durationInMeasures;
            expect(this.lesson.noteList[5].percentOnComplete).to.equal(expectedDuration);
        });

        it('should always have the intervals of all the notes it contains', function () {
            expect(this.lesson.intervals.length).to.equal(5);
        });

        it('should always know the lowest note it contains', function () {
            expect(this.lesson.lowestNote.name).to.equal('A1');
            this.lesson.addNotes([['C0', '1/16'], ['Ab1', '1/32']]);
            expect(this.lesson.lowestNote.name).to.equal('C0');
        });

        it('should always know the highest note it contains', function () {
            expect(this.lesson.highestNote.name).to.equal('C4');
            this.lesson.addNotes([['C5', '1/16'], ['B4', '1/32']]);
            expect(this.lesson.highestNote.name).to.equal('C5');
        });

        it('should always know the full range of the notes it contains', function () {
            expect(this.lesson.getLessonRange()).to.equal(27);
        });

    });

    describe('with multiple notes', function () {
        beforeEach(function () {
            this.createTheseNotes = [
                {name: 'B2', duration: '1/8'},
                {name: 'A1', duration: '1/2'},
                {name: 'Db3', duration: '1/4'},
                {name: 'B2', duration: '1/32'}
            ];
            this.expectedList = [
                {name: 'B2', duration: '1/8'},
                {name: 'A1', duration: '1/2'},
                {name: 'Db3', duration: '1/4'},
                {name: 'B2', duration: '1/32'}
            ];
            this.lesson.addNotes(this.createTheseNotes);
        });

        it('can be created at once with object literal notation', function () {
            compareNoteLists(this.lesson.noteList, this.expectedList);
        });


        it('should have the correct chart', function () {
            var expectedChart = {
                'A1': 16, 'Bb1': 15, 'B1': 14, 'C2': 13, 'Db2': 12, 'D2': 11, 'Eb2': 10,
                'E2': 9, 'F2': 8, 'Gb2': 7, 'G2': 6, 'Ab2': 5, 'A2': 4, 'Bb2': 3, 'B2': 2,
                'C3': 1, 'Db3': 0
            };
            expect(this.lesson.chart).to.eql(expectedChart);
            expect(this.lesson.highestNote.name).to.equal('Db3');
            expect(this.lesson.lowestNote.name).to.equal('A1');
        });


        it('can be created at once with nested arrays', function () {
            var arrayList = [['B2', '1/8'], ['A1', '1/2'], ['Db3', '1/4'], ['B2', '1/32']];
            var fromArray = this.lesson._createListOfNoteObjects(arrayList);
            compareNoteLists(fromArray, this.expectedList);
        });

        it('passed to _getHighestDenominator() should return the highest denominator', function () {
            expect(this.lesson._getHighestDenominator(this.lesson.noteList)).to.equal(32);
        });

        it('createListOfIntervalsFromNotes() should return an accurate list', function () {
            expect(this.lesson.intervals.length).to.equal(3);
        });

        it('smallestNoteSize should return measure size of the smallest note', function () {
            this.lesson.addNotes([{name: 'B2', duration: '1/64'}]);
            expect(this.lesson.smallestNoteSize).to.equal(0.015625);
        });

    });
});

describe('Lesson constructor with silentNotes', function() {
    beforeEach(function () {
        var arrayList = [['-', '1/8'], ['A2', '1/2'], ['-', '1/4'], ['B2', '1/32'], ['A2', '1/2']];
        this.lesson = new Lesson({ noteList: arrayList });
    });

    it('should get correct duration in measures', function () {
        expect(this.lesson.durationInMeasures).to.equal(1.40625);
    });

    it('should get correct duration in milliseconds', function () {
        var beatCount = this.lesson.durationInMeasures * this.lesson.tempo;
        var minute = 60000;
        var expectedMs = beatCount * (minute / this.lesson.bpm);
        expect(this.lesson.durationInMilliseconds).to.equal(expectedMs);
    });

    it('should get correct range', function () {
        expect(this.lesson.getLessonRange()).to.equal(2);
    });

    it('should have the right number of notes', function () {
        expect(this.lesson.noteList.length).to.equal(5);
    });

    it('should have the right number of intervals', function () {
        expect(this.lesson.intervals.length).to.equal(4);
    });

    it('should have three intervals with silent notes', function () {
        expect(this.lesson.intervals[0].startNote).to.equal('-');
        expect(this.lesson.intervals[1].endNote).to.equal('-');
        expect(this.lesson.intervals[2].startNote).to.equal('-');
    });

});


function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).to.equal(expectedList[i].name);
        expect(noteList[i].duration).to.equal(expectedList[i].duration);
    }
}