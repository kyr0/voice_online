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
    SET_IS_PLAYING,

    // actionCreators
    getLessons,
    setCurrentLesson,
    nextLesson,
    previousLesson,
    setIsPlayingIfReady,
} from '../../../../src/client/js/react/actions/singActions.babel';
import { initialSingState, initialProfileState } from '../../../../src/client/js/react/reducers/reducers.babel';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('singActions', () => {


    let server;
    let store;
    let state;
    const initialState = { sing: initialSingState, profile: initialProfileState };
    const dummy_lesson_data = {
        results: [
            { url: '1', title: 'dummy title 1' },
            { url: '2', title: 'dummy title 2' },
            { url: '3', title: 'dummy title 3' },
        ],
    };
    const dummy_profile_data = { 'some_dummy': 'user data' };


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
            JSON.stringify(dummy_lesson_data)
        );
        store = mockStore(state);
        const expectedActions = [
            { type: GET_LESSONS_REQUEST },
            { type: SET_IS_PLAYING, isPlaying: false },
            { type: SET_CURRENT_LESSON, currentLesson: dummy_lesson_data.results[0] },
            { type: GET_LESSONS_SUCCESS, lessons: dummy_lesson_data },
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
        state.sing.currentLesson = dummy_lesson_data;
        store = mockStore(state);
        store.dispatch(setCurrentLesson(expected_data));
        expect(store.getActions()[1].type).to.eql(SET_CURRENT_LESSON);
        expect(store.getActions()[1].currentLesson).to.eql(expected_data);
    });

    it('should create an action to set currentLesson to next item', () => {
        state.sing.currentLesson = dummy_lesson_data.results[1];
        state.sing.lessons.results = dummy_lesson_data.results;
        store = mockStore(state);
        store.dispatch(nextLesson());
        expect(store.getActions()[1].type).to.eql(SET_CURRENT_LESSON);
        expect(store.getActions()[1].currentLesson).to.eql(dummy_lesson_data.results[2]);
    });

    it('should create an action to set currentLesson to previous item', () => {
        state.sing.currentLesson = dummy_lesson_data.results[1];
        state.sing.lessons.results = dummy_lesson_data.results;
        store = mockStore(state);
        store.dispatch(previousLesson());
        expect(store.getActions()[1].type).to.eql(SET_CURRENT_LESSON);
        expect(store.getActions()[1].currentLesson).to.eql(dummy_lesson_data.results[0]);
    });

    it('should have nextLesson go to first idx when current is last lesson', () => {
        state.sing.currentLesson = dummy_lesson_data.results[2];
        state.sing.lessons.results = dummy_lesson_data.results;
        store = mockStore(state);
        store.dispatch(nextLesson());
        expect(store.getActions()[1].currentLesson).to.eql(dummy_lesson_data.results[0]);
    });

    it('should have previousLesson go to last idx when current is first lesson', () => {
        state.sing.currentLesson = dummy_lesson_data.results[0];
        state.sing.lessons.results = dummy_lesson_data.results;
        store = mockStore(state);
        store.dispatch(previousLesson());
        expect(store.getActions()[1].currentLesson).to.eql(dummy_lesson_data.results[2]);
    });

    it('should not set isPlaying if no user in state', () => {
        state.sing.currentLesson = dummy_lesson_data.results[0];
        store = mockStore(state);
        store.dispatch(setIsPlayingIfReady(true));
        expect(store.getActions()).to.eql([]);
    });

    it('should not set isPlaying if no currentLesson in state', () => {
        state.profile.user = dummy_profile_data;
        store = mockStore(state);
        store.dispatch(setIsPlayingIfReady(true));
        expect(store.getActions()).to.eql([]);
    });

    it('should set isPlaying true if user and currentLesson are set', () => {
        state.sing.currentLesson = dummy_lesson_data.results[0];
        state.profile.user = dummy_profile_data;
        store = mockStore(state);
        store.dispatch(setIsPlayingIfReady(true));
        expect(store.getActions()[0].isPlaying).to.eql(true);
    });

    it('should not create an action if the state will be unchanged', () => {
        store = mockStore(state);
        store.dispatch(setIsPlayingIfReady(initialSingState.isPlaying));
        expect(store.getActions()).to.eql([]);
    });
});
