import { cloneDeep } from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { LESSONS_URL } from '../../../../src/client/js/constants/constants.babel';
import {
    // actions
    GET_LESSONS_REQUEST,
    GET_LESSONS_SUCCESS,
    GET_LESSONS_FAILURE,
    SET_CURRENT_LESSON,

    // actionCreators
    getLessons,
    setCurrentLesson,
} from '../../../../src/client/js/react/actions/lessonActions.babel';
import { initialSingState } from '../../../../src/client/js/react/reducers/reducers.babel';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('lessonActions', () => {


    let server;
    let store;
    let state;
    const initialState = { sing: initialSingState };
    const dummy_data = '{ "any_data": "we want" }';

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
        state = cloneDeep(initialState);
    });

    afterEach( () => {
        server.restore();
    });

    it('should create an action to GET lessons request successful response', (done) => {
        server.respondWith(
            'GET',
            LESSONS_URL,
            dummy_data
        );
        store = mockStore(state);
        const expectedActions = [
            { type: GET_LESSONS_REQUEST },
            { type: GET_LESSONS_SUCCESS, lessons: JSON.parse(dummy_data) },
        ];
        store.dispatch(getLessons())
            .then(() => {
                expect(store.getActions()).to.eql(expectedActions);
                done();
            })
            .catch(done);
    });

    it('should create an action to GET lessons request failure response', (done) => {
        server.respondWith(
            'GET',
            LESSONS_URL,
            [404, {}, 'dummy error']
        );
        store = mockStore(state);
        store.dispatch(getLessons())
            .then(() => {
                expect(store.getActions()[0].type).to.eql(GET_LESSONS_REQUEST);
                expect(store.getActions()[1].type).to.eql(GET_LESSONS_FAILURE);
                expect(store.getActions()[1].error).to.exist;
                done();
            })
            .catch(done);
    });

    it('should create an action to set currentLesson', () => {
        let expected_data = { notEmpty: null };
        state.sing.currentLesson = dummy_data;
        store = mockStore(state);
        store.dispatch(setCurrentLesson(expected_data));
        expect(store.getActions()[0].type).to.eql(SET_CURRENT_LESSON);
        expect(store.getActions()[0].currentLesson).to.eql(expected_data);
    });
});
