import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';

import Canvas from './Canvas.babel';

export default class LessonList extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(currentLesson) {
        const { doLessonSelect } = this.props;
        doLessonSelect(currentLesson);
    }


    render() {
        const { user, lessons, currentLesson } = this.props;
        return (
            <Grid fluid={true}>
                <Row><Col xs={12}>
                    <Panel collapsible ref={this.panelRef} id='lessons-dropdown' header={currentLesson.title}>
                            <ListGroup fill>
                            { lessons.map(
                                (lesson, idx) =>
                                    <ListGroupItem key={idx} onClick={this.handleClick.bind(this, lesson)}>
                                        { lesson.title }
                                    </ListGroupItem>
                            )}
                            </ListGroup>
                            {/*<span> Upper: { user.upper_range } Lower: { user.lower_range } </span>*/}
                    </Panel>
                </Col></Row>
                <Row><Col xs={12}>
                    <Canvas />
                </Col></Row>
            </Grid>
        );
    }
}

LessonList.propTypes = {
    user: PropTypes.object.isRequired,
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
    doLessonSelect: PropTypes.func.isRequired,
};