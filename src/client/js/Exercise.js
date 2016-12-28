'use strict';

var Lesson = require('./Lesson.js');
var InvalidRangeError = require('./customErrors').InvalidRangeError;

function Exercise(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new InvalidRangeError('User range must be same or larger than Lesson range.');
    }

    var baseSet = null;
    var baseDistance = aLesson.lowestNote.getDistanceToNote(aUser.bottomNote);

    function transposeLesson(distance){
        var introSilenceDurationInMeasures = (aLesson.tempo * aLesson.introLengthInMeasures) +
                                             '/' + aLesson.tempo;

        var newNotes = [];
        newNotes.push(['-', introSilenceDurationInMeasures]); // intro silence
        for(var nt = 0; nt < aLesson.noteList.length; nt++){
            var newNoteName = aLesson.noteList[nt].transpose(distance);
            var noteDuration = aLesson.noteList[nt].duration;
            newNotes.push([newNoteName, noteDuration]);
        }

        var newCaps = [];
        newCaps.push(['', introSilenceDurationInMeasures]);
        for(var cap = 0; cap < aLesson.captionList.length; cap++) {
            var newCapText = aLesson.captionList[cap].text;
            var newCapDuration = aLesson.captionList[cap].duration;
            newCaps.push([newCapText, newCapDuration]);
        }

        var newOptions = {
            bpm: aLesson.bpm,
            title: aLesson.title,
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
            sets.push(transposeLesson(aSet + baseDistance));
        }
        return sets;
    }

    baseSet = transposeLesson(baseDistance);
    this.sets = generateSets();
}

module.exports = Exercise;