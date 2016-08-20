import { combineReducers } from 'redux';
import {
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from '../actions/index.babel';


const initialState = {};

export function user(state = initialState, action) {
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

const rootReducer = combineReducers({
    user,
});

export default rootReducer;
