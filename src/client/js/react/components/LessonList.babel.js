import React, { Component, PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default class LessonList extends Component {

    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(eventKey) {
        const { doLessonSelect } = this.props;
        const currentLesson = this.refs[eventKey].props.lesson;
        doLessonSelect(currentLesson);
    }


    render() {
        const { user, lessons, currentLesson } = this.props;
        const refPrefix = 'lesson';
        return (
            <DropdownButton id='lessons-dropdown' title={currentLesson.title}>
                    { lessons.map(
                        (lesson, idx) =>
                            <MenuItem key={idx} ref={refPrefix + idx} eventKey={refPrefix + idx} lesson={lesson} onSelect={this.handleSelect}>
                                { lesson.title }
                            </MenuItem>
                    )}
                {/*<span> Upper: { user.upper_range } Lower: { user.lower_range } </span>*/}
            </DropdownButton>
        );
    }
}

LessonList.propTypes = {
    user: PropTypes.object.isRequired,
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
    doLessonSelect: PropTypes.func.isRequired,
};