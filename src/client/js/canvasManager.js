var Lesson = require('./Lesson.js');
var User = require('./User.js');
var Player = require('./Player.js');

var theUser = new User('C3', 'C5');


function initLesson(lessonProps){
    window.curLesson = new Lesson(lessonProps);
    if (window.lPlayer) {  // for the case where we load a new lesson during play
        if (window.lPlayer.isPlaying) {
            window.lPlayer.stop();
        }
    }
    window.lPlayer = new Player(theUser, window.curLesson);
    window.initLessonCanvas();
}


module.exports = {
    initLesson: initLesson
};
