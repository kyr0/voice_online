
"use strict";

var Lesson = require("../../src/browser/js/Lesson.js");

describe('Lesson', function() {
    beforeEach(function () {
        this.lesson = new Lesson();
        this.newNotes = [
            {name: "B2", noteLength: "1/8"},
            {name: "A1", noteLength: "1/2"},
            {name: "Db3", noteLength: "1/4"},
            {name: "B2", noteLength: "1"}
        ];
    });

    describe('with multiple notes', function() {
        beforeEach(function () {
            this.lesson.addNotes(this.newNotes);
        });

        it('should know how many notes it contains', function () {
            expect(this.lesson.countNoteObjects()).toEqual(this.newNotes.noteLength);
        });

        it('should know the combined length of all the notes it contains', function () {
            expect(this.lesson.getLessonLength()).toEqual('15/8');
        });
    });




});