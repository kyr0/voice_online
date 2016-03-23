"use strict";
var Lesson = require("./Lesson.js");
var InvalidRangeError = require("./customErrors").InvalidRangeError;

function Exercise(aUser, aLesson){

    if (aUser.range < aLesson.getLessonRange()){
        throw new InvalidRangeError('User range must be same or larger than Lesson range.');
    }

    var baseSet = null;
    var baseDistance = aLesson.lowestNote.getDistanceToNote(aUser.bottomNote.name);

    function transposeLesson(distance, baseLesson){
        var newNotes = [];
        for(var note = 0; note < baseLesson.notes.length; note++){
            var newNoteName = baseLesson.notes[note].transpose(distance);
            var noteLength = baseLesson.notes[note].length;
            newNotes.push([newNoteName, noteLength]);
        }
        var newCaps = [];
        for(var cap = 0; cap < baseLesson.captions.length; cap++) {
            var newCapText = baseLesson.captions[cap].text;
            var newCapLength = baseLesson.captions[cap].length;
            newCaps.push([newCapText, newCapLength]);
        }
        return new Lesson({ noteList: newNotes, captionList: newCaps });
    }

    function generateSets(){
        var sets = [];
        sets.push(baseSet);
        var setCount = baseSet.highestNote.getDistanceToNote(aUser.topNote.name) + 1;
        for (var set = 1; set < setCount; set++){
            sets.push(transposeLesson(set, baseSet));
        }
        for (set = 0; set < sets.length; set++){
            var ntList = sets[set].notes;
            sets[set].chart = {};
            for (var nt = 0; nt < ntList.length; nt++){
                sets[set].chart[ntList[nt].name] = ntList[nt].relativeInterval;
            }
        }
        return sets;
    }

    baseSet = transposeLesson(baseDistance, aLesson);
    this.sets = generateSets();
}

module.exports = Exercise;