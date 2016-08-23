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

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('userActions', () => {

    let server;
    let store;
    const dummy_data = '{ "any_data": "we want" }';

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
        store = mockStore({});
    });

    afterEach( () => {
        server.restore();
    });


    it('should not dispatch a GET action if user exists', () => {
        store = mockStore({ user: { notEmpty: null } });
        store.dispatch(getUserIfNeeded());
        expect(store.getActions()).to.eql([]);
    });

    it('should create an action to GET user request successful response', (done) => {
        server.respondWith(
            'GET',
            CURRENT_USER_URL,
            dummy_data
        );
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
        store = mockStore({ user: dummy_data });
        store.dispatch(updateUserIfNeeded(dummy_data));
        expect(store.getActions()).to.eql([]);
    });

    it('should create an action to UPDATE user request successful response', (done) => {
        store = mockStore({ user: 'some bogus' });
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
        store = mockStore({ user: 'some bogus' });
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
