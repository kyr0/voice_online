import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';

import LessonList from '../components/LessonList.babel';
import Widget from '../components/Widget.babel';


export default class Sing extends Component {

    render() {
        const {
            user,
            lessons,
            currentLesson,
            gridSize,
            doLessonSelect,
            doPreviousLessonSelect,
            doPlayLessonSelect,
            doNextLessonSelect,
        } = this.props;

        return (
            <Grid fluid={true}>
                <Row><Col xs={12}>
                     <LessonList
                         lessons={ lessons }
                         currentLesson={ currentLesson }
                         doLessonSelect={ doLessonSelect }
                     />
                </Col></Row><Row><Col>
                     <Widget
                         user={ user }
                         currentLesson={ currentLesson }
                         gridSize={ gridSize }
                     />
                </Col></Row><Row><Col>
                    <div className="sing-btn-group">
                        <Button bsClass="btn-transparent" onClick={ doPreviousLessonSelect }>
                            <Image src="static/assets/play.png" circle responsive />
                        </Button>
                        <Button bsClass="btn-transparent" onClick={ doPlayLessonSelect }>
                            <Image src="static/assets/play.png" circle responsive />
                        </Button>
                        <Button bsClass="btn-transparent" onClick={ doNextLessonSelect }>
                            <Image src="static/assets/play.png" circle responsive />
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
    doLessonSelect: PropTypes.func.isRequired,
    doPreviousLessonSelect: PropTypes.func.isRequired,
    doNextLessonSelect: PropTypes.func.isRequired,
    doPlayLessonSelect: PropTypes.func.isRequired,
};

