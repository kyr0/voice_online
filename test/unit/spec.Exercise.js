'use strict';
var _ = require('lodash');

var Exercise = require('../../src/client/js/Exercise.js');
var InvalidRangeError = require('../../src/client/js/customErrors.js').InvalidRangeError;
var User = require('../../src/client/js/User.js');
var Lesson = require('../../src/client/js/Lesson.js');


describe('Exercise', function () {

    it('should throw error if user range is smaller than lesson range', function () {
        var aUser = new User('A2', 'E3');
        var aLesson = new Lesson({ noteList: [['A2', '1'], ['F3', '1']] });
        var fn = function () {
            var dum = new Exercise(aUser, aLesson);
        };
        expect(fn).to.throw(InvalidRangeError);
    });

    it('should start with a new Lesson object at the bottom of user range', function () {
        var aUser = new User('A2', 'A4');
        var aLesson = new Lesson({ noteList:  [['B2', '1'], ['F3', '1']] });
        var exercise = new Exercise(aUser, aLesson);
        expect(exercise.sets[0].lowestNote.name).to.equal('A2');
    });

    it('should have sets as Lesson objects relative to users lowest note', function () {
        var aUser = new User('B1', 'B3');
        var aLesson = new Lesson({ noteList:  [['C2', '1'], ['C3', '1']] });
        var exercise = new Exercise(aUser, aLesson);
        expect(exercise.sets[12].lowestNote.name).to.equal('B2');
    });

    it('should transpose all notes in Lesson correctly (base set)', function () {
        var aUser = new User('A2', 'A4');
        var aLesson = new Lesson({
            noteList: [['B2','1/8'],['A1','1/2'],['Db3','1/4'],['B2','1/32']],
            captionList: [['One','1/8'],['-','1/2'],['Two','1/4'],['Three','1/32']],
        });
        var exercise = new Exercise(aUser, aLesson);
        var expected = {
            noteList: [
                { name: '-', duration: '4/4' },
                { name: 'B3', duration: '1/8' },
                { name: 'A2', duration: '1/2' },
                { name: 'Db4', duration: '1/4' },
                { name: 'B3', duration: '1/32' },
            ],
            captionList: [
                { text: '', duration: '4/4' },
                { text: 'One', duration: '1/8' },
                { text: '-', duration: '1/2' },
                { text: 'Two', duration: '1/4' },
                { text: 'Three', duration: '1/32' },
            ],
        };
        compareLessonLists(exercise.sets[0], expected);
    });

    it('should transpose all notes and captions in Lesson correctly (2nd set)', function () {
        var aUser = new User('A2', 'A4');
        var aLesson = new Lesson({
            noteList: [['B2','1/8'],['-','1/2'],['Db3','1/4'],['B2','1/32']],
            captionList: [['','1/8'],['One','1/2'],['Two','1/4'],['Three','1/32']],
        });
        var exercise = new Exercise(aUser, aLesson);
        var expected = {
            noteList: [
                { name: '-', duration: '4/4' },
                { name: 'Bb2', duration: '1/8' },
                { name: '-', duration: '1/2' },
                { name: 'C3', duration: '1/4' },
                { name: 'Bb2', duration: '1/32' },
            ],
            captionList: [
                { text: '', duration: '4/4' },
                { text: '', duration: '1/8' },
                { text: 'One', duration: '1/2' },
                { text: 'Two', duration: '1/4' },
                { text: 'Three', duration: '1/32' },
            ],
        };
        compareLessonLists(exercise.sets[1], expected);
    });

    it('should have the right number of sets based on Lesson / User ranges (final set)', function () {
        var aUser = new User('A2', 'Ab4');
        var aLesson = new Lesson({ noteList: [['B2', '1'], ['-', '1']] });
        this.exercise = new Exercise(aUser, aLesson);
        expect(this.exercise.sets.length).to.equal(24);
    });

    it('should preserve all non-transposed options from original lesson in each set', function () {
        var aUser = new User('A2', 'Ab4');
        var aLesson = new Lesson({ noteList: [['B2', '1'], ['-', '1']], bpm: 50, title: 'title' });
        this.exercise = new Exercise(aUser, aLesson);
        _.forEach(this.exercise.sets, function (set) {
            expect(set.bpm).to.equal(50);
            expect(set.title).to.equal('title');
        });
    });

    it('should not erase functions on Note object during transpose', function () {
        var aUser = new User('A2', 'Ab4');
        var aLesson = new Lesson({ noteList: [['B2', '1'], ['-', '1']], bpm: 50, title: 'title' });
        this.exercise = new Exercise(aUser, aLesson);
        _.forEach(this.exercise.sets, function (set) {
            _.forEach(set.noteList, function (nt) {
                expect(nt.transpose).to.be.truthy;
            });
        });
    });

});


function compareLessonLists(aSet, expected) {
    for (var i = 0; i < expected.noteList.length; i++) {
        expect(aSet.noteList[i].name).to.equal(expected.noteList[i].name);
        expect(aSet.noteList[i].duration).to.equal(expected.noteList[i].duration);
    }
    for (var j = 0; j < expected.captionList.length; j++) {
        expect(aSet.captionList[j].text).to.equal(expected.captionList[j].text);
        expect(aSet.captionList[j].duration).to.equal(expected.captionList[j].duration);
    }
}