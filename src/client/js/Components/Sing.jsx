var React = require('react');
var axios = require('../lib/helpers').axios;

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
        var upper = this.props.data.upper_range;
        var lower = this.props.data.lower_range;
        var lessonNodes = this.props.data.results.map(function(lesson) {
            return (
                <LessonData owner={lesson.owner} key={lesson.url} noteList={lesson.notes}
                            captionList={lesson.captions} bpm={lesson.bpm} upper={upper} lower={lower}>
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
        axios('/api/lesson/')
            .then(function(response) {
                this.setState({
                    data: {
                        results: response.data.results,
                        upper_range: this.state.data.upper_range,
                        lower_range: this.state.data.lower_range
                    }
                });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    },

    loadUserFromServer: function() {
        axios('/api/profile/current/')
            .then(function(response) {
                this.setState({
                    data: {
                        results: this.state.data.results,
                        upper_range: response.data.upper_range,
                        lower_range: response.data.lower_range
                    }
                });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    },

    getInitialState: function() {
        return {
            data: {
                results: [],
                upper_range: 'C4',
                lower_range: 'C3'
            },
        };
    },

    componentDidMount: function() {
        this.loadLessonsFromServer();
        this.loadUserFromServer();
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


export default React.createClass({
    render: function() {
        return (
            <div>
                <LessonBox pollInterval={2000} />
            </div>
        );
    }
});
