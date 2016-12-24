import { cloneDeep } from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CURRENT_USER_URL, LOGIN_URL, LOGOUT_URL } from '../../../../src/client/js/constants/constants.babel';
import {
    // actions
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE,

    // actionCreators
    getUserIfNeeded,
    updateUserIfNeeded,
    loginUser,
    logoutUser,
} from '../../../../src/client/js/react/actions/userActions.babel';
import { initialProfileState, initialAuthState } from '../../../../src/client/js/react/reducers/reducers.babel';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('userActions', () => {

    let server;
    let store;
    let state;
    const initialState = {
        profile: initialProfileState,
        auth: initialAuthState,
    };
    const dummyData = '{ "any_data": "we want" }';
    const dummyReload = () => {};

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

    describe('loginUser', () => {

        it('should create correct actions on successful response', (done) => {
            server.respondWith(
                'POST',
                LOGIN_URL,
                [200, {}, 'yay']
            );
            store = mockStore(state);
            const mockCreds = {
                username: 'dummy',
                password: 'dummy',
            };
            store.dispatch(loginUser(mockCreds, dummyReload))
                .then(() => {
                    expect(store.getActions()[0].type).to.eql(LOGIN_USER_REQUEST);
                    expect(store.getActions()[1].type).to.eql(LOGIN_USER_SUCCESS);
                    expect(store.getActions()[1].response).to.exist;
                    done();
                })
                .catch(done);
        });

        it('should create correct actions on failure response', (done) => {
            server.respondWith(
                'POST',
                LOGIN_URL,
                [404, {}, 'dummy']
            );
            store = mockStore(state);
            store.dispatch(loginUser())
                .then(() => {
                    expect(store.getActions()[0].type).to.eql(LOGIN_USER_REQUEST);
                    expect(store.getActions()[1].type).to.eql(LOGIN_USER_FAILURE);
                    expect(store.getActions()[1].error).to.exist;
                    done();
                })
                .catch(done);
        });
    });


    describe('logoutUser', () => {

        it('should create correct actions on successful response', (done) => {
            server.respondWith(
                'POST',
                LOGOUT_URL,
                [200, {}, 'yay']
            );
            store = mockStore(state);
            store.dispatch(logoutUser(dummyReload))
                .then(() => {
                    expect(store.getActions()[0].type).to.eql(LOGOUT_USER_REQUEST);
                    expect(store.getActions()[1].type).to.eql(LOGOUT_USER_SUCCESS);
                    expect(store.getActions()[1].response).to.exist;
                    done();
                })
                .catch(done);
        });

        it('should create correct actions on failure response', (done) => {
            server.respondWith(
                'POST',
                LOGOUT_URL,
                [404, {}, 'dummy']
            );
            store = mockStore(state);
            store.dispatch(logoutUser())
                .then(() => {
                    expect(store.getActions()[0].type).to.eql(LOGOUT_USER_REQUEST);
                    expect(store.getActions()[1].type).to.eql(LOGOUT_USER_FAILURE);
                    expect(store.getActions()[1].error).to.exist;
                    done();
                })
                .catch(done);
        });
    });


    describe('getUserIfNeeded', () => {

        it('should not dispatch a GET action if user exists', () => {
            state.profile.user = dummyData;
            store = mockStore(state);
            store.dispatch(getUserIfNeeded());
            expect(store.getActions()).to.eql([]);
        });

        it('should create an action to GET user request successful response', (done) => {
            server.respondWith(
                'GET',
                CURRENT_USER_URL,
                dummyData
            );
            store = mockStore(state);
            const expectedActions = [
                { type: GET_USER_REQUEST },
                { type: GET_USER_SUCCESS, user: JSON.parse(dummyData) },
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
    });


    describe('updateUserIfNeeded', () => {

        it('should not dispatch an UPDATE action if user is the same as new data', () => {
            state.profile.user = dummyData;
            store = mockStore(state);
            store.dispatch(updateUserIfNeeded(dummyData));
            expect(store.getActions()).to.eql([]);
        });

        it('should create an action to UPDATE user request successful response', (done) => {
            state.profile.user = 'some bogus';
            store = mockStore(state);
            server.respondWith(
                'PUT',
                CURRENT_USER_URL,
                dummyData
            );
            store.dispatch(updateUserIfNeeded(dummyData))
                .then(() => {
                    expect(store.getActions()[0].type).to.eql(UPDATE_USER_REQUEST);
                    expect(store.getActions()[0].user).to.eql(dummyData);
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
            store.dispatch(updateUserIfNeeded(dummyData))
                .then(() => {
                    expect(store.getActions()[0].type).to.eql(UPDATE_USER_REQUEST);
                    expect(store.getActions()[0].user).to.eql(dummyData);
                    expect(store.getActions()[1].type).to.eql(UPDATE_USER_FAILURE);
                    expect(store.getActions()[1].error).to.exist;
                    done();
                })
                .catch(done);
        });
    });
});
