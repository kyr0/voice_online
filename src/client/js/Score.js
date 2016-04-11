'use strict';

var _ = require('lodash');


function Score() {
    this._noteScores = [];
    this._setScores = [];
    this._lessonScores = [];
    this.scoredSets = [];
}

Score.prototype.pushScore = function(score){
    this._noteScores.push(score);
};

Score.prototype.storeNoteScores = function(curNote){
    this._setScores.push({ scores: this._noteScores, curNote: curNote });
    this._noteScores = [];
};

Score.prototype.storeSetScores = function(){
    this._lessonScores.push(this._setScores);
    this._setScores = [];
};


Score.prototype.evaluateExerciseScores = function() {
    var that = this;
    function _evaluateNotesInSets() {
        _.forEach(that._lessonScores, function (aSet) {
            var scoredSet = [];
            _.forEach(aSet, function (aNote) {
                if (aNote.curNote.name !== '-') {
                    // TODO the 1st two points are usually off, hence _.drop(), investigate MPM for improvements
                    var averageNoteDiff = _.meanBy(_.drop(aNote.scores, 2), function (aPoint) {
                        var curScore = null;
                        if (aPoint[0] === null) {
                            curScore = 100;
                        }
                        else {
                            // scores can be + or - 50 cents off key
                            curScore = 2 * Math.abs(aPoint[0]);
                        }
                        return curScore;
                    });
                    var noteScore = 100 - Math.round(averageNoteDiff);
                    scoredSet.push(noteScore);
                }
            });
            that.scoredSets.push(scoredSet);
        });
    }
    _evaluateNotesInSets();
};


Score.prototype.getAggregateNoteScores = function () {
    var aggregateNoteScores = [];
    //_.forEach(setScores, function(aSet){
    //    var anAggNoteScore = 0;
    //    _.forEach(aSet, function(aSet){
    //        anAggNoteScore += setScores[aSet2][aNote2];
    //    });
    //});

    for (var aNote = 0; aNote < this.scoredSets[0].length; aNote++) {
        var anAggNoteScore = 0;
        for (var aSet = 0; aSet < this.scoredSets.length; aSet++) {
            anAggNoteScore += this.scoredSets[aSet][aNote];
        }
        anAggNoteScore = anAggNoteScore / this.scoredSets.length;
        aggregateNoteScores.push(anAggNoteScore);
    }
    return aggregateNoteScores;
};

module.exports = Score;