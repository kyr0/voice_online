var Lesson = require('./Lesson.js');
var User = require('./User.js');
var Player = require('./Player.js');

var canvasProps = null;

function initLesson(props){
    if (props) {
        canvasProps = props;
    }
    window.curLesson = new Lesson(canvasProps);
    var theUser = new User(canvasProps.lower, canvasProps.upper);
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
