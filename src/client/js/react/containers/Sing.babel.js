import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

import { setCurrentLesson } from '../actions/lessonActions.babel';
import { updateGridSizeIfNeeded } from '../actions/windowActions.babel';
import LessonList from '../components/LessonList.babel';
import Canvas from '../components/Canvas.babel';

class Sing extends Component {

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleLessonSelect = this.handleLessonSelect.bind(this);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        const { dispatch } = this.props;
        dispatch(updateGridSizeIfNeeded());
    }

    handleLessonSelect(lessonData) {
        this.props.dispatch(setCurrentLesson(lessonData));
    }

    render() {
        const { user, lessons, currentLesson } = this.props;
        return (
            <Grid fluid={true}>
                <Row><Col xs={12}>
                     <LessonList
                         user={ user }
                         lessons={ lessons }
                         currentLesson={ currentLesson }
                         doLessonSelect={ this.handleLessonSelect }
                     />
                </Col></Row><Row><Col>
                     <Canvas user={ user } currentLesson={ currentLesson } />
                </Col></Row>
            </Grid>
        );
    }
}


Sing.propTypes = {
    user: PropTypes.object.isRequired,
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.profile.user,
        lessons: state.sing.lessons.results,
        currentLesson: state.sing.currentLesson,
    };
};

export default connect(mapStateToProps)(Sing);
