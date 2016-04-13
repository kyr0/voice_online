'use strict';

var Score = require('../../src/client/js/Score.js');
var _ = require('lodash');

describe('Score', function() {

    beforeEach(function () {
        this.score = new Score();
    });

    it('evaluateExerciseScores() should calculate the right result (perfect score)', function () {
        var scores = [[[50, -50, 0, 0, 0, 0]]];
        this.score._lessonScores = generateScoreInput(scores);
        this.score.evaluateExerciseScores();
        expect(this.score.scoredSets[0][0]).to.equal(100);
    });

    it('evaluateExerciseScores() should calculate the right result (perfect score with 2 leading junk values)', function () {
        var scores = [[[null, -50, 0, 0, 0, 0]]];
        this.score._lessonScores = generateScoreInput(scores);
        this.score.evaluateExerciseScores();
        expect(this.score.scoredSets[0][0]).to.equal(100);
    });

    it('evaluateExerciseScores() should calculate the right result (unpitched)', function () {
        var scores = [[[null, null, null, null, null, null]]];
        this.score._lessonScores = generateScoreInput(scores);
        this.score.evaluateExerciseScores();
        expect(this.score.scoredSets[0][0]).to.equal(0);
    });

    it('evaluateExerciseScores() should calculate the right result (uncharted note)', function () {
        var scores = [[[null, null, null, null, null, null]]];
        this.score._lessonScores = generateScoreInput(scores);
        this.score.evaluateExerciseScores();
        expect(this.score.scoredSets[0][0]).to.equal(0);
    });

    it('evaluateExerciseScores() should calculate the right result (sharp)', function () {
        var scores = [[[30, 30, 30, 30, 30, 30]]];
        this.score._lessonScores = generateScoreInput(scores);
        this.score.evaluateExerciseScores();
        expect(this.score.scoredSets[0][0]).to.equal(40);
    });

    it('evaluateExerciseScores() should calculate the right result (flat)', function () {
        var scores = [[[-50, -50, -50, -50, -50, -50]]];
        this.score._lessonScores = generateScoreInput(scores);
        this.score.evaluateExerciseScores();
        expect(this.score.scoredSets[0][0]).to.equal(0);
    });

    it('evaluateExerciseScores() should calculate the right result (mixed with null)', function () {
        var scores = [[[0, 0, null, 0, 50, 0, -50, 0]]]; // two leading are not calculated
        this.score._lessonScores = generateScoreInput(scores);
        this.score.evaluateExerciseScores();
        expect(this.score.scoredSets[0][0]).to.equal(50); // 50%
    });

    // TEST AGGREGATE NOTE & INTERVAL SCORES

    function generateScoreInput(scores) {
        var lessonScores = [];
        var setScores = [];
        var noteScores = [];
        _.forEach(scores, function(aSet) {
            _.forEach(aSet, function(aNote) {
                _.forEach(aNote, function(value) {
                    noteScores.push(value);
                });
                setScores.push(noteScores);
                noteScores = [];
            });
            lessonScores.push(setScores);
            setScores = [];
        });
        return lessonScores;
    }

});
