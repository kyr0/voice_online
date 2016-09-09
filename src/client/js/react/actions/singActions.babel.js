import { axios } from '../../lib/helpers';

import { LESSONS_URL } from '../../constants/constants.babel';

export const GET_LESSONS_REQUEST = 'GET_LESSONS_REQUEST';
export const GET_LESSONS_SUCCESS = 'GET_LESSONS_SUCCESS';
export const GET_LESSONS_FAILURE = 'GET_LESSONS_FAILURE';
export const SET_CURRENT_LESSON = 'SET_CURRENT_LESSON';
export const SET_IS_PLAYING = 'SET_IS_PLAYING';

import { initialSingState, initialProfileState } from '../reducers/reducers.babel';


/*
 * LESSON API REQUESTS
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
 * CURRENT LESSON RELATED
 */
export function setCurrentLesson(currentLesson) {
    return {
        type: SET_CURRENT_LESSON,
        currentLesson,
    };
}


function getCurrentLessonIndex(singState) {
    const lessons = singState.lessons.results;
    const currentLesson = singState.currentLesson;
    let foundIdx = null;
    lessons.find(function (lesson, idx) {
        if (lesson.url === currentLesson.url) {
            foundIdx = idx;
        }
    });
    return foundIdx;
}


export function nextLesson() {
    return (dispatch, getState) =>  {
        const singState = getState().sing;
        const curIdx = getCurrentLessonIndex(singState);
        if (singState.lessons.results.length === curIdx + 1) {
            dispatch(setCurrentLesson(singState.lessons.results[0]));
        } else {
            dispatch(setCurrentLesson(singState.lessons.results[curIdx + 1]));
        }
    };
}


export function previousLesson() {
    return (dispatch, getState) =>  {
        const singState = getState().sing;
        const curIdx = getCurrentLessonIndex(singState);
        const lastIdx = singState.lessons.results.length - 1;
        if (curIdx === 0) {
            dispatch(setCurrentLesson(singState.lessons.results[lastIdx]));
        } else {
            dispatch(setCurrentLesson(singState.lessons.results[curIdx - 1]));
        }
    };
}


/*
 * IS WIDGET PLAYING
 */

function setIsPlaying(isPlaying) {
    return {
        type: SET_IS_PLAYING,
        isPlaying,
    };
}

export function setIsPlayingIfReady(isPlaying) {
    return (dispatch, getState) =>  {
        if (typeof isPlaying !== 'boolean') throw Error('isPlaying must be boolean.');
        if (isPlaying) {
            const state = getState();
            if (state.sing.currentLesson === initialSingState.currentLesson ||
                state.profile.user === initialProfileState.user) {
                return;
            }
        }
        dispatch(setIsPlaying(isPlaying));
    };
}

