import React, { Component, PropTypes } from 'react';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';


export default class LessonList extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            panelIsOpen: false,
        };
    }

    handleClick(currentLesson) {
        this.setState({ open: !this.state.panelIsOpen });
        const { doLessonSelect } = this.props;
        doLessonSelect(currentLesson);
    }

    isSelected(lesson) {
        const { currentLesson } = this.props;
        return lesson.title === currentLesson.title;
    }


    render() {
        const { lessons, currentLesson } = this.props;
        return (
            <Panel
                bsClass="lessons-panel"
                collapsible
                expanded={this.state.panelIsOpen}
                onClick={() => this.setState({ panelIsOpen: !this.state.panelIsOpen })}
                ref={this.panelRef}
                id='lessons-dropdown'
                header={currentLesson.title}
            >
                    <ListGroup fill>
                    { lessons.map(
                        (lesson, idx) =>
                            <ListGroupItem
                                key={idx}
                                onClick={this.handleClick.bind(this, lesson)}
                                active={this.isSelected(lesson)}
                            >
                                { lesson.title }
                            </ListGroupItem>
                    )}
                    </ListGroup>
            </Panel>
        );
    }
}

LessonList.propTypes = {
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
    doLessonSelect: PropTypes.func.isRequired,
};