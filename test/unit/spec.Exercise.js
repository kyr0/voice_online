"use strict";

var Exercise = require("../../src/client/js/Exercise.js").Exercise;
var InvalidRangeError = require("../../src/client/js/Exercise.js").InvalidRangeError;
var User = require("../../src/client/js/User.js");
var Lesson = require("../../src/client/js/Lesson.js");


describe('Exercise', function() {

    it("should throw error if user range is smaller than lesson range", function () {
        var aUser = new User("A2", "E3");
        var aLesson = new Lesson([["A2", "1"], ["F3", "1"]]);
        var fn = function(){
            var dum = new Exercise(aUser, aLesson);
        };
        expect(fn).to.throw(InvalidRangeError);
    });

    it("should start with a new Lesson object at the bottom of user's range", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2", "1"], ["F3", "1"]]);
        var exercise = new Exercise(aUser, aLesson);
        expect(exercise.sets[0].lowestNote.name).to.equal("A2");
    });

    it("should have sets as Lesson objects relative to users lowest note", function () {
        var aUser = new User("B1", "B3");
        var aLesson = new Lesson([["C2", "1"], ["C3", "1"]]);
        var exercise = new Exercise(aUser, aLesson);
        expect(exercise.sets[12].lowestNote.name).to.equal("B2");
    });

    it("should transpose all notes in Lesson correctly (base set)", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2","1/8"],["A1","1/2"],["Db3","1/4"],["B2","1/32"]]);
        var exercise = new Exercise(aUser, aLesson);
        var expectedList = [
            {name: "B3", noteLength: "1/8"},
            {name: "A2", noteLength: "1/2"},
            {name: "Db4", noteLength: "1/4"},
            {name: "B3", noteLength: "1/32"}
        ];
        compareNoteLists(exercise.sets[0].notes, expectedList);
    });

    it("should transpose all notes in Lesson correctly (final set)", function () {
        var aUser = new User("A2", "A4");
        var aLesson = new Lesson([["B2","1/8"],["A1","1/2"],["Db3","1/4"],["B2","1/32"]]);
        var exercise = new Exercise(aUser, aLesson);
        var expectedList = [
            {name: "G4", noteLength: "1/8"},
            {name: "F3", noteLength: "1/2"},
            {name: "A4", noteLength: "1/4"},
            {name: "G4", noteLength: "1/32"}
        ];
        compareNoteLists(exercise.sets.pop().notes, expectedList);
    });

    it("should have the right number of sets based on Lesson / User ranges (final set)", function () {
        var aUser = new User("A2", "Ab4");
        var aLesson = new Lesson([["B2", "1"]]);
        this.exercise = new Exercise(aUser, aLesson);
        expect(this.exercise.sets.length).to.equal(24);
    });

});


function compareNoteLists(noteList, expectedList) {
    for (var i = 0; i < noteList.length; i++) {
        expect(noteList[i].name).to.equal(expectedList[i].name);
        expect(noteList[i].noteLength).to.equal(expectedList[i].noteLength);
    }
}