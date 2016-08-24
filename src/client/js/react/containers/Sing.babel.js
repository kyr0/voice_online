import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LessonList from '../components/LessonList.babel';


class Sing extends Component {

    render() {
        const { user, lessons } = this.props;
        return (
             <LessonList user={ user } lessons={ lessons } />
        );
    }
}


Sing.propTypes = {
    user: PropTypes.object,
    lessons: PropTypes.array,
};

const mapStateToProps = (state) => {
    return {
        user: state.profile.user,
        lessons: state.sing.lessons.results,
    };
};

export default connect(mapStateToProps)(Sing);
