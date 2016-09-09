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
    SET_IS_PLAYING,
} from '../actions/singActions.babel';

import {
    SET_GRID_SIZE,
} from '../actions/windowActions.babel';


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
    currentLesson: { title: 'Loading...' },
    isPlaying: false,
    isRequesting: false,
    lessons: { results: [] },
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
    case SET_IS_PLAYING:
        return Object.assign({}, state, {
            isPlaying: action.isPlaying,
        });
    default:
        return state;
    }
}


export const initialLayoutState = {
    gridSize: '',
};
export function layout(state = initialLayoutState, action) {
    switch (action.type) {
    case SET_GRID_SIZE:
        return Object.assign({}, state, {
            gridSize: action.gridSize,
        });
    default:
        return state;
    }
}


const rootReducer = combineReducers({
    profile,
    sing,
    layout,
    form: formReducer,
});

export default rootReducer;
