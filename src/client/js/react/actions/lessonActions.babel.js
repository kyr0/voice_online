import { axios } from '../../lib/helpers';

import { LESSONS_URL } from '../../constants/constants.babel';

export const GET_LESSONS_REQUEST = 'GET_LESSONS_REQUEST';
export const GET_LESSONS_SUCCESS = 'GET_LESSONS_SUCCESS';
export const GET_LESSONS_FAILURE = 'GET_LESSONS_FAILURE';
export const SET_CURRENT_LESSON = 'SET_CURRENT_LESSON';

/*
 GET LESSONS
 */
function getLessonsRequest() {
    return {
        type: GET_LESSONS_REQUEST,
    };
}

function receiveLessons(lessons) {
    return {
        type: GET_LESSONS_SUCCESS,
        lessons,
    };
}


function getLessonsError(error) {
    return {
        type: GET_LESSONS_FAILURE,
        error,
    };
}


export function getLessons() {
    return dispatch => {
        dispatch(getLessonsRequest());
        return axios(LESSONS_URL)
            .then(response => response.data)
            .then(lessons => {
                dispatch(setCurrentLesson(lessons.results[0]));
                dispatch(receiveLessons(lessons));
            })
            .catch(error => dispatch(getLessonsError(error)));
    };
}

/*
 MISC
 */
export function setCurrentLesson(currentLesson) {
    return {
        type: SET_CURRENT_LESSON,
        currentLesson,
    };
}