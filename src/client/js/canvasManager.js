var Lesson = require('./Lesson.js');
var User = require('./User.js');
var Player = require('./Player.js');


function initLesson(props){
    window.curLesson = new Lesson(props);
    var theUser = new User(props.lower, props.upper);
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
