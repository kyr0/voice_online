var React = require('react');
var $ = require('jquery');

var canvasMgr = require('../canvasManager.js');


var LessonData = React.createClass({
    handleClick: function() {
        canvasMgr.initLesson(this.props);
    },
    render: function() {
        return (
            <div className="lessonData" onClick={this.handleClick}>
                {this.props.children}
            </div>
        );
    }
});

var LessonList = React.createClass({
    render: function() {
        var lessonNodes = this.props.data.results.map(function(lesson) {
            return (
                <LessonData owner={lesson.owner} key={lesson.url} noteList={lesson.notes}
                            captionList={lesson.captions} bpm={lesson.bpm}>
                    {lesson.title}
                </LessonData>
            );
        });
        return (
            <div className="lessonList">
                {lessonNodes}
            </div>
        );
    }
});

var LessonBox = React.createClass({
    loadLessonsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: {"results": []}};
    },
    componentDidMount: function() {
        this.loadLessonsFromServer();
        setInterval(this.loadLessonsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="lessonBox">
                <h1>Lessons</h1>
                <LessonList data={this.state.data} />
            </div>
        );
    }
});

module.exports = LessonBox;