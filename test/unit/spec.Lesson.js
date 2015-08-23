
"use strict";

var Lesson = require("../../src/browser/js/Lesson.js");

describe('Lesson', function() {
    beforeEach(function () {
        this.lesson = new Lesson();
    });

    it('should have default bpm of 120', function () {
        expect(this.lesson.bpm).toEqual(120);
    });

    it('should be able to set its BPM speed', function () {
        this.lesson.bpm = 130;
        expect(this.lesson.bpm).toEqual(130);
    });



    describe('with multiple notes', function() {
        beforeEach(function () {
            this.newNotes = [
                {name: "B2", noteLength: "1/8"},
                {name: "A1", noteLength: "1/2"},
                {name: "Db3", noteLength: "1/4"},
                {name: "B2", noteLength: "1"}
            ];
            this.lesson.addNotes(this.newNotes);
        });

        it('should know how many notes it contains', function () {
            expect(this.lesson.countNoteObjects()).toEqual(this.newNotes.noteLength);
        });

        it('should always know the combined length of all the notes it contains', function () {
            this.lesson.addNotes([["B3","1/16"],["C4","1/32"]]);
            expect(this.lesson.getLessonLength()).toEqual('63/32');
        });
    });

});