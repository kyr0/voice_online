import { cloneDeep } from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CURRENT_USER_URL } from '../../../../src/client/js/constants/constants.babel';
import {
    // actions
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,

    // actionCreators
    getUserIfNeeded,
    updateUserIfNeeded,
} from '../../../../src/client/js/react/actions/userActions.babel';
import { initialProfileState } from '../../../../src/client/js/react/reducers/reducers.babel';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('userActions', () => {

    let server;
    let store;
    let state;
    const initialState = { profile: initialProfileState };
    const dummy_data = '{ "any_data": "we want" }';

    beforeEach(() => {
        document.body.innerHTML = '<script id="main-script" data-authenticated="true"></script>';
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
        state = cloneDeep(initialState);
    });

    afterEach(() => {
        server.restore();
        store = null;
        state = null;
    });

    it('should not dispatch a GET action if user exists', () => {
        state.profile.user = dummy_data;
        store = mockStore(state);
        store.dispatch(getUserIfNeeded());
        expect(store.getActions()).to.eql([]);
    });

    it('should create an action to GET user request successful response', (done) => {
        server.respondWith(
            'GET',
            CURRENT_USER_URL,
            dummy_data
        );
        store = mockStore(state);
        const expectedActions = [
            { type: GET_USER_REQUEST },
            { type: GET_USER_SUCCESS, user: JSON.parse(dummy_data) },
        ];
        store.dispatch(getUserIfNeeded())
            .then(() => {
                expect(store.getActions()).to.eql(expectedActions);
                done();
            })
            .catch(done);
    });

    it('should create an action to GET user request failure response', (done) => {
        server.respondWith(
            'GET',
            CURRENT_USER_URL,
            [404, {}, 'dummy']
        );
        store = mockStore(state);
        store.dispatch(getUserIfNeeded())
            .then(() => {
                expect(store.getActions()[0].type).to.eql(GET_USER_REQUEST);
                expect(store.getActions()[1].type).to.eql(GET_USER_FAILURE);
                expect(store.getActions()[1].error).to.exist;
                done();
            })
            .catch(done);
    });

    it('should not dispatch an UPDATE action if user is the same as new data', () => {
        state.profile.user = dummy_data;
        store = mockStore(state);
        store.dispatch(updateUserIfNeeded(dummy_data));
        expect(store.getActions()).to.eql([]);
    });

    it('should create an action to UPDATE user request successful response', (done) => {
        state.profile.user = 'some bogus';
        store = mockStore(state);
        server.respondWith(
            'PUT',
            CURRENT_USER_URL,
            dummy_data
        );
        store.dispatch(updateUserIfNeeded(dummy_data))
            .then(() => {
                expect(store.getActions()[0].type).to.eql(UPDATE_USER_REQUEST);
                expect(store.getActions()[0].user).to.eql(dummy_data);
                expect(store.getActions()[1].type).to.eql(UPDATE_USER_SUCCESS);
                expect(store.getActions()[1].response).to.exist;
                done();
            })
            .catch(done);
    });

    it('should create an action to UPDATE user request failure response', (done) => {
        state.profile.user = 'some bogus';
        store = mockStore(state);
        server.respondWith(
            'PUT',
            CURRENT_USER_URL,
            [404, {}, 'dummy']
        );
        store.dispatch(updateUserIfNeeded(dummy_data))
            .then(() => {
                expect(store.getActions()[0].type).to.eql(UPDATE_USER_REQUEST);
                expect(store.getActions()[0].user).to.eql(dummy_data);
                expect(store.getActions()[1].type).to.eql(UPDATE_USER_FAILURE);
                expect(store.getActions()[1].error).to.exist;
                done();
            })
            .catch(done);
    });
});
