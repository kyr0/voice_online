import { axios } from '../../lib/helpers';

import { CURRENT_USER_URL, LOGIN_URL, LOGOUT_URL } from '../../constants/constants.babel';
import { initialProfileState } from '../reducers/reducers.babel';


export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGOUT_USER_REQUEST = 'LOGOUT_USER_REQUEST';
export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';
export const LOGOUT_USER_FAILURE = 'LOGOUT_USER_FAILURE';


export function isAuthenticated() {
    return document.getElementById('main-script').getAttribute('data-authenticated') === 'true';
}


/*
 GET USER
 */
function getUserRequest() {
    return {
        type: GET_USER_REQUEST,
    };
}

function receiveUser(user) {
    return {
        type: GET_USER_SUCCESS,
        user,
    };
}


function getUserError(error) {
    return {
        type: GET_USER_FAILURE,
        error,
    };
}


function getUser() {
    return dispatch => {
        dispatch(getUserRequest());
        return axios(CURRENT_USER_URL)
            .then(response => response.data)
            .then(user => dispatch(receiveUser(user)))
            .catch(error => dispatch(getUserError(error)));
    };
}


export function getUserIfNeeded() {
    return (dispatch, getState) => {
        if ((JSON.stringify(getState().profile.user) === JSON.stringify(initialProfileState.user)) && isAuthenticated())
        {
            return dispatch(getUser());
        }
    };
}


/*
 *  UPDATE USER
 */
function updateUserRequest(new_user_data) {
    return {
        type: UPDATE_USER_REQUEST,
        user: new_user_data,
    };
}


function updateUserSuccess(response) {
    return {
        type: UPDATE_USER_SUCCESS,
        response,
    };
}


function updateUserError(error) {
    return {
        type: UPDATE_USER_FAILURE,
        error,
    };
}


function updateUser(new_user_data) {
    return dispatch => {
        dispatch(updateUserRequest(new_user_data));
        return axios.put(CURRENT_USER_URL, new_user_data)
            .then(response => dispatch(updateUserSuccess(response)))
            .catch(error => dispatch(updateUserError(error)));
    };
}


function shouldUpdateUser(user, new_user_data) {
    let should = false;
    for (let key in new_user_data) {
        if (new_user_data[key] !== user[key]) {
            should = true;
        }
    }
    return should;
}


export function updateUserIfNeeded(new_user_data) {
    return (dispatch, getState) =>  {
        const user = getState().profile.user;
        if (shouldUpdateUser(user, new_user_data) && isAuthenticated()) {
            return dispatch(updateUser(new_user_data));
        }
    };
}

/*
 *  LOGIN
 */
function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST,
    };
}


function loginUserSuccess(response, reload) {
    reload(true);
    return {
        type: LOGIN_USER_SUCCESS,
        response,
    };
}


function loginUserError(error) {
    return {
        type: LOGIN_USER_FAILURE,
        error,
    };
}


export function loginUser(credentials, reload = window.location.reload.bind(window.location)) {
    return dispatch => {
        dispatch(loginUserRequest());
        return axios.post(LOGIN_URL, credentials)
            .then(response => dispatch(loginUserSuccess(response, reload)))
            .catch(error => dispatch(loginUserError(error)));
    };
}

/*
 *  LOGOUT
 */
function logoutUserRequest() {
    return {
        type: LOGOUT_USER_REQUEST,
    };
}


function logoutUserSuccess(response, reload) {
    reload(true);
    return {
        type: LOGOUT_USER_SUCCESS,
        response,
    };
}


function logoutUserError(error) {
    return {
        type: LOGOUT_USER_FAILURE,
        error,
    };
}


export function logoutUser(reload = window.location.reload.bind(window.location)) {
    return dispatch => {
        dispatch(logoutUserRequest());
        return axios.post(LOGOUT_URL)
            .then(response => dispatch(logoutUserSuccess(response, reload)))
            .catch(error => dispatch(logoutUserError(error)));
    };
}
