import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
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
    updateUserIfNeeded
} from '../../../../src/client/js/react/actions/index.babel'

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('actions', () => {

    let server;
    let store;
    const user_data = '{ "upper_range": "C5", "lower_range": "C4" }';

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
        store = mockStore({});
    });

    afterEach( () => {
        server.restore();
    });


    it('should not dispatch a GET action if user exists', () => {
        store = mockStore({ user: 'some bogus'});
        store.dispatch(getUserIfNeeded());
        expect(store.getActions()).to.eql([]);
    });

    it('should create an action to GET user request successful response', (done) => {
        server.respondWith(
            "GET",
            "/api/profile/current/",
            user_data
        );
        const expectedActions = [
            { type: GET_USER_REQUEST },
            { type: GET_USER_SUCCESS, user: JSON.parse(user_data) }
        ];
        store.dispatch(getUserIfNeeded())
            .then(() => {
                expect(store.getActions()).to.eql(expectedActions);
                done();
            })
            .catch(done)
    });

    it('should create an action to GET user request failure response', (done) => {
        server.respondWith(
            "GET",
            "/api/profile/current/",
            [404, {}, 'dummy']
        );
        store.dispatch(getUserIfNeeded())
            .then(() => {
                expect(store.getActions()[0].type).to.eql(GET_USER_REQUEST);
                expect(store.getActions()[1].type).to.eql(GET_USER_FAILURE);
                expect(store.getActions()[1].error).to.exist;
                done();
            })
            .catch(done)
    });

    it('should not dispatch an UPDATE action if user is the same as new data', () => {
        store = mockStore({ user: user_data});
        store.dispatch(updateUserIfNeeded(user_data));
        expect(store.getActions()).to.eql([]);
    });

    it('should create an action to UPDATE user request successful response', (done) => {
        store = mockStore({ user: 'some bogus'});
        server.respondWith(
            "PUT",
            "/api/profile/current/",
            user_data
        );
        store.dispatch(updateUserIfNeeded(user_data))
            .then(() => {
                expect(store.getActions()[0].type).to.eql(UPDATE_USER_REQUEST);
                expect(store.getActions()[0].user).to.eql(user_data);
                expect(store.getActions()[1].type).to.eql(UPDATE_USER_SUCCESS);
                expect(store.getActions()[1].response).to.exist;
                done();
            })
            .catch(done)
    });

    it('should create an action to UPDATE user request failure response', (done) => {
        store = mockStore({ user: 'some bogus'});
        server.respondWith(
            "PUT",
            "/api/profile/current/",
            [404, {}, 'dummy']
        );
        store.dispatch(updateUserIfNeeded(user_data))
            .then(() => {
                expect(store.getActions()[0].type).to.eql(UPDATE_USER_REQUEST);
                expect(store.getActions()[0].user).to.eql(user_data);
                expect(store.getActions()[1].type).to.eql(UPDATE_USER_FAILURE);
                expect(store.getActions()[1].error).to.exist;
                done();
            })
            .catch(done)
    });
});
