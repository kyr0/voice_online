import React, { Component, PropTypes } from 'react';

export default class LessonList extends Component {
    render() {
        const { user, lessons } = this.props;
        return (
            <ul>
                <span> Upper: { user.upper_range } Lower: { user.lower_range } </span>
                { lessons.map(
                    (lesson, idx) => <li key={ idx }> { lesson.title } </li>
                )}
            </ul>
        );
    }
}

LessonList.propTypes = {
    user: PropTypes.object.isRequired,
    lessons: PropTypes.array.isRequired,
};
