import { axios } from '../../lib/helpers';

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';


/*
 *  GET USER
 */
function getUserRequest() {
    return {
        type: GET_USER_REQUEST,
    }
}


function receiveUser(user) {
    return {
        type: GET_USER_SUCCESS,
        user
    }
}


function getUserError(error) {
    return {
        type: GET_USER_FAILURE,
        error,
    }
}


function getUser() {
    return dispatch => {
        dispatch(getUserRequest());
        return axios('/api/profile/current/')
            .then(response => response.data)
            .then(user => dispatch(receiveUser(user)))
            .catch(error => dispatch(getUserError(error)));
    }
}


function shouldGetUser(state) {
    return !state.user
}


export function getUserIfNeeded() {
    return (dispatch, getState) => {
        if (shouldGetUser(getState())) {
            return dispatch(getUser())
        }
    }
}

/*
 *  UPDATE USER
 */
function updateUserRequest(new_user_data) {
    return {
        type: UPDATE_USER_REQUEST,
        user: new_user_data
    }
}


function updateUserSuccess(response) {
    return {
        type: UPDATE_USER_SUCCESS,
        response
    }
}


function updateUserError(error) {
    return {
        type: UPDATE_USER_FAILURE,
        error
    }
}


function updateUser(new_user_data) {
    return dispatch => {
        dispatch(updateUserRequest(new_user_data));
        return axios.put('/api/profile/current/', new_user_data)
            .then(response => dispatch(updateUserSuccess(response)))
            .catch(error => dispatch(updateUserError(error)));
    }

}


export function updateUserIfNeeded(new_user_data) {
    return (dispatch, getState) =>  {
        if (getState().user != new_user_data) {  // if there are changes
            return dispatch(updateUser(new_user_data))
        }

    }

}
