'use strict';
var _ = require('lodash');

var Exercise = require('../../src/client/js/Exercise.js');
var InvalidRangeError = require('../../src/client/js/customErrors.js').InvalidRangeError;
var User = require('../../src/client/js/User.js');
var Lesson = require('../../src/client/js/Lesson.js');


describe('Exercise', function() {

    it('should throw error if user range is smaller than lesson range', function () {
        var aUser = new User('A2', 'E3');
        var aLesson = new Lesson({ noteList: [['A2', '1'], ['F3', '1']] });
        var fn = function(){
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
            captionList: [['One','1/8'],['-','1/2'],['Two','1/4'],['Three','1/32']]
        });
        var exercise = new Exercise(aUser, aLesson);
        var expected = {
            notes: [
                {name: 'B3', length: '1/8'},
                {name: 'A2', length: '1/2'},
                {name: 'Db4', length: '1/4'},
                {name: 'B3', length: '1/32'}
            ],
            captions: [
                {text: 'One', length: '1/8'},
                {text: '-', length: '1/2'},
                {text: 'Two', length: '1/4'},
                {text: 'Three', length: '1/32'}
            ]
        };
        compareLessonLists(exercise.sets[0], expected);
    });

    it('should transpose all notes in Lesson correctly (final set)', function () {
        var aUser = new User('A2', 'A4');
        var aLesson = new Lesson({
            noteList: [['B2','1/8'],['-','1/2'],['Db3','1/4'],['B2','1/32']],
            captionList: [['','1/8'],['One','1/2'],['Two','1/4'],['Three','1/32']]
        });
        var exercise = new Exercise(aUser, aLesson);
        var expected = {
            notes: [
                {name: 'G4', length: '1/8'},
                {name: '-', length: '1/2'},
                {name: 'A4', length: '1/4'},
                {name: 'G4', length: '1/32'}
            ],
            captions: [
                {text: '', length: '1/8'},
                {text: 'One', length: '1/2'},
                {text: 'Two', length: '1/4'},
                {text: 'Three', length: '1/32'}
            ]
        };
        compareLessonLists(exercise.sets.pop(), expected);
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
        _.forEach(this.exercise.sets, function(set) {
            expect(set.bpm).to.equal(50);
            expect(set.title).to.equal('title');
        });
    });

});


function compareLessonLists(aSet, expected) {
    for (var i = 0; i < aSet.notes.length; i++) {
        expect(aSet.notes[i].name).to.equal(expected.notes[i].name);
        expect(aSet.notes[i].length).to.equal(expected.notes[i].length);
    }
    for (var j = 0; j < aSet.captions.length; j++) {
        expect(aSet.captions[j].text).to.equal(expected.captions[j].text);
        expect(aSet.captions[j].length).to.equal(expected.captions[j].length);
    }
}