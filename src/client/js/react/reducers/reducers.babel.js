import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import {
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from '../actions/userActions.babel';

import {
    GET_LESSONS_REQUEST,
    GET_LESSONS_SUCCESS,
    GET_LESSONS_FAILURE,
    SET_CURRENT_LESSON,
} from '../actions/lessonActions.babel';


export const initialProfileState = { isRequesting: false, user: {} };
export function profile(state = initialProfileState, action) {
    switch (action.type) {
    case GET_USER_REQUEST:
        return Object.assign({}, state, {
            isRequesting: true,
        });
    case GET_USER_SUCCESS:
        return Object.assign({}, state, {
            isRequesting: false,
            user: action.user,
        });
    case GET_USER_FAILURE:
        return Object.assign({}, state, {
            isRequesting: false,
        });
    case UPDATE_USER_REQUEST:
        return Object.assign({}, state, {
            isRequesting: true,
            user: action.user,
        });
    case UPDATE_USER_SUCCESS:
        return Object.assign({}, state, {
            isRequesting: false,
        });
    case UPDATE_USER_FAILURE:
        return Object.assign({}, state, {
            isRequesting: false,
        });
    default:
        return state;
    }
}

export const initialSingState = {
    isRequesting: false,
    lessons: { results: [] },
    currentLesson: { title: 'Loading...' },
};
export function sing(state = initialSingState, action) {
    switch (action.type) {
    case GET_LESSONS_REQUEST:
        return Object.assign({}, state, {
            isRequesting: true,
        });
    case GET_LESSONS_SUCCESS:
        return Object.assign({}, state, {
            isRequesting: false,
            lessons: action.lessons,
        });
    case GET_LESSONS_FAILURE:
        return Object.assign({}, state, {
            isRequesting: false,
        });
    case SET_CURRENT_LESSON:
        return Object.assign({}, state, {
            currentLesson: action.currentLesson,
        });
    default:
        return state;
    }
}

const rootReducer = combineReducers({
    profile,
    sing,
    form: formReducer,
});

export default rootReducer;
