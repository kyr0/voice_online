'use strict';

var Lesson = require('./Lesson.js');
var InvalidRangeError = require('./customErrors').InvalidRangeError;

function Exercise(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new InvalidRangeError('User range must be same or larger than Lesson range.');
    }

    var baseSet = null;
    var baseDistance = aLesson.lowestNote.getDistanceToNote(aUser.bottomNote);

    function transposeLesson(distance, baseLesson){
        var newNotes = [];
        for(var nt = 0; nt < baseLesson.noteList.length; nt++){
            var newNoteName = baseLesson.noteList[nt].transpose(distance);
            var noteDuration = baseLesson.noteList[nt].duration;
            newNotes.push([newNoteName, noteDuration]);
        }
        var newCaps = [];
        for(var cap = 0; cap < baseLesson.captionList.length; cap++) {
            var newCapText = baseLesson.captionList[cap].text;
            var newCapDuration = baseLesson.captionList[cap].duration;
            newCaps.push([newCapText, newCapDuration]);
        }
        var newOptions = {
            bpm: baseLesson.bpm,
            title: baseLesson.title,
            noteList: newNotes,
            captionList: newCaps,
        };
        return new Lesson(newOptions);
    }

    function generateSets(){
        // A set is an instance of Lesson relative to the user's range.  An exercise will have one
        // set for every possible pitch within the user's range.
        var sets = [];
        sets.push(baseSet);
        var setCount = baseSet.highestNote.getDistanceToNote(aUser.topNote) + 1;
        for (var aSet = 1; aSet < setCount; aSet++){
            sets.push(transposeLesson(aSet, baseSet));
        }
        return sets;
    }

    baseSet = transposeLesson(baseDistance, aLesson);
    this.sets = generateSets();
}

module.exports = Exercise;