import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    // actions
    GET_USER_REQUEST,
    GET_USER_SUCCESS,

    // actionCreators
    getUserIfNeeded
} from '../../../../src/client/js/react/actions/index.babel'

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('actions', () => {

    let server;
    let store;

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
        store = mockStore({});
    });

    afterEach( () => {
        server.restore();
    });


    it('should create an action to GET user request', (done) => {
        server.respondWith(
            "GET",
            "/api/profile/current/",
            '{ "upper_range": "C5", "lower_range": "C4" }'
        );
        const expectedActions = [
            { type: GET_USER_REQUEST },
            { type: GET_USER_SUCCESS, user: { "upper_range": "C5", "lower_range": "C4" }}
        ];
        store.dispatch(getUserIfNeeded())
            .then(() => { // return of async actions
                expect(store.getActions()).to.eql(expectedActions);
                done();
            })
            .catch(done)
    })
});
