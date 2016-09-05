import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';

import { setCurrentLesson, nextLesson, previousLesson } from '../actions/lessonActions.babel';
import { updateGridSizeIfNeeded } from '../actions/windowActions.babel';
import LessonList from '../components/LessonList.babel';
import Widget from '../components/Widget.babel';

class Sing extends Component {

    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleLessonSelect = this.handleLessonSelect.bind(this);
    }

    componentWillMount() {
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

    handleNextLessonSelect() {
        this.props.dispatch(nextLesson());
    }

    handlePreviousLessonSelect() {
        this.props.dispatch(previousLesson());
    }

    render() {
        const { user, lessons, currentLesson, gridSize } = this.props;
        return (
            <Grid fluid={true}>
                <Row><Col xs={12}>
                     <LessonList
                         lessons={ lessons }
                         currentLesson={ currentLesson }
                         doLessonSelect={ this.handleLessonSelect }
                     />
                </Col></Row><Row><Col>
                     <Widget
                         user={ user }
                         currentLesson={ currentLesson }
                         gridSize={ gridSize }
                     />
                </Col></Row><Row><Col>
                    <div className="sing-btn-group">
                        <Button bsStyle="transparent" onClick={this.handlePreviousLessonSelect.bind(this)}>
                            <Image src="static/assets/placeholder.png" circle responsive />
                        </Button>
                        <Button bsStyle="transparent">
                            <Image src="static/assets/placeholder.png" circle responsive />
                        </Button>
                        <Button bsStyle="transparent" onClick={this.handleNextLessonSelect.bind(this)}>
                            <Image src="static/assets/placeholder.png" circle responsive />
                        </Button>
                    </div>
                </Col></Row>
            </Grid>
        );
    }
}


Sing.propTypes = {
    user: PropTypes.object.isRequired,
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
    gridSize: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.profile.user,
        lessons: state.sing.lessons.results,
        currentLesson: state.sing.currentLesson,
        gridSize: state.layout.gridSize,
    };
};

export default connect(mapStateToProps)(Sing);
