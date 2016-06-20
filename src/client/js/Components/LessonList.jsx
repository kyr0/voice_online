var React = require('react');
var $ = require('jquery');


// tutorial7.js
var Lesson = React.createClass({
    render: function() {
        return (
            <div className="lesson">
                <h2 className="lessonOwner">
                    {this.props.owner}
                </h2>
                {this.props.children}
                {JSON.stringify(this.props.notes)}
                {JSON.stringify(this.props.captions)}
            </div>
        );
    }
});

// tutorial10.js
var LessonList = React.createClass({
    render: function() {
        var lessonNodes = this.props.data.results.map(function(lesson) {
            return (
                <Lesson owner={lesson.owner} key={lesson.url} notes={lesson.notes} captions={lesson.captions}>
                    {lesson.title}
                </Lesson>
            );
        });
        return (
            <div className="lessonList">
                {lessonNodes}
            </div>
        );
    }
});

// tutorial9.js
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