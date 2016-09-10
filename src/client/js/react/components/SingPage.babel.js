import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Image, Button } from 'react-bootstrap';

import LessonList from '../components/LessonList.babel';
import Widget from '../containers/Widget.babel';


export default class Sing extends Component {

    render() {
        const {
            lessons,
            currentLesson,
            isPlaying,
            doLessonSelect,
            doPreviousLessonSelect,
            doPlayLessonSelect,
            doNextLessonSelect,
        } = this.props;
        const playButtonUrl = isPlaying ? 'static/assets/stop.png' : 'static/assets/play.png';

        return (
            <Grid fluid={true}>
                <Row><Col xs={12}>
                     <LessonList
                         lessons={ lessons }
                         currentLesson={ currentLesson }
                         doLessonSelect={ doLessonSelect }
                     />
                </Col></Row><Row><Col>
                     <Widget />
                </Col></Row><Row><Col>
                    <div className="sing-btn-group">
                        <Button bsClass="btn-transparent" onClick={ doPreviousLessonSelect }>
                            <Image src="static/assets/previous.png" circle responsive />
                        </Button>
                        <Button bsClass="btn-transparent" onClick={ doPlayLessonSelect }>
                            <Image src={ playButtonUrl } circle responsive />
                        </Button>
                        <Button bsClass="btn-transparent" onClick={ doNextLessonSelect }>
                            <Image src="static/assets/next.png" circle responsive />
                        </Button>
                    </div>
                </Col></Row>
            </Grid>
        );
    }
}


Sing.propTypes = {
    lessons: PropTypes.array.isRequired,
    currentLesson: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    doLessonSelect: PropTypes.func.isRequired,
    doPreviousLessonSelect: PropTypes.func.isRequired,
    doNextLessonSelect: PropTypes.func.isRequired,
    doPlayLessonSelect: PropTypes.func.isRequired,
};

