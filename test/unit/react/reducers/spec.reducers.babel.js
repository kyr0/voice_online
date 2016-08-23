import {
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from '../../../../src/client/js/react/actions/userActions.babel';

import {
    GET_LESSONS_REQUEST,
    GET_LESSONS_SUCCESS,
    GET_LESSONS_FAILURE,
} from '../../../../src/client/js/react/actions/lessonActions.babel';

import { profile, initialProfileState, sing, initialSingState } from '../../../../src/client/js/react/reducers/reducers.babel';


describe('profile reducer', () => {
    it('should return initial state for unknown action', () => {
        const newState = profile(initialProfileState, { type: 'BOGUS_REQUEST' });
        expect(newState).to.eql(initialProfileState);
    });

    it('should set state for GET_USER_REQUEST', () => {
        const initialState = { isRequesting: false };
        const newState = profile(initialState, { type: GET_USER_REQUEST });
        expect(newState).to.eql({ isRequesting: true });
    });

    it('should set state for GET_USER_FALIURE', () => {
        const initialState = { isRequesting: true };
        const newState = profile(initialState, { type: GET_USER_FAILURE });
        expect(newState).to.eql({ isRequesting: false });
    });

    it('should set state for GET_USER_SUCCESS', () => {
        const initialState = { isRequesting: true };
        const dummy_data = 'some datas';
        const newState = profile(
            initialState,
            { type: GET_USER_SUCCESS, user: dummy_data }
        );
        expect(newState).to.eql({ isRequesting: false, user: dummy_data });
    });

    it('should set state for UPDATE_USER_FAILURE', () => {
        const initialState = { isRequesting: true };
        const newState = profile(initialState, { type: UPDATE_USER_FAILURE });
        expect(newState).to.eql({ isRequesting: false });
    });

    it('should set state for UPDATE_USER_SUCCESS', () => {
        const initialState = { isRequesting: true };
        const newState = profile(initialState, { type: UPDATE_USER_SUCCESS });
        expect(newState).to.eql({ isRequesting: false });
    });

    it('should set state for UPDATE_USER_REQUEST', () => {
        const initialState = { isRequesting: false };
        const dummy_data = 'some datas';
        const newState = profile(
            initialState,
            { type: UPDATE_USER_REQUEST, user: dummy_data }
        );
        expect(newState).to.eql({ isRequesting: true, user: dummy_data });
    });
});


describe('sing reducer', () => {
    it('should return initial state for unknown action', () => {
        const newState = sing(initialSingState, { type: 'BOGUS_REQUEST' });
        expect(newState).to.eql(initialSingState);
    });

    it('should set state for GET_LESSONS_REQUEST', () => {
        const initialState = { isRequesting: false };
        const newState = sing(initialState, { type: GET_LESSONS_REQUEST });
        expect(newState).to.eql({ isRequesting: true });
    });

    it('should set state for GET_LESSONS_FALIURE', () => {
        const initialState = { isRequesting: true };
        const newState = sing(initialState, { type: GET_LESSONS_FAILURE });
        expect(newState).to.eql({ isRequesting: false });
    });

    it('should set state for GET_LESSONS_SUCCESS', () => {
        const initialState = { isRequesting: true };
        const dummy_data = 'some datas';
        const newState = sing(
            initialState,
            { type: GET_LESSONS_SUCCESS, lessons: dummy_data }
        );
        expect(newState).to.eql({ isRequesting: false, lessons: dummy_data });
    });
});
