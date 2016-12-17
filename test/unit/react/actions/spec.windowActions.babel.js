import { cloneDeep } from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
    // actions
    SET_GRID_SIZE,

    // actionCreators
    updateGridSizeIfNeeded,
} from '../../../../src/client/js/react/actions/windowActions.babel';

import { initialLayoutState } from '../../../../src/client/js/react/reducers/reducers.babel';
import { GRID_LG, GRID_MD, GRID_SM, GRID_XS, GRID_SIZES } from '../../../../src/client/js/constants/constants.babel.js';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);


describe('windowActions', () => {

    let store;
    let state;
    const initialState = { layout: initialLayoutState };

    beforeEach(() => {
        state = cloneDeep(initialState);
    });

    it('should not create an action to updateGridSize if already correct', () => {
        state.layout.gridSize = GRID_LG;
        store = mockStore(state);
        store.dispatch(updateGridSizeIfNeeded(GRID_SIZES.LG));
        expect(store.getActions()).to.eql([]);
    });

    it('should create an action to updateGridSize to GRID_LG', () => {
        store = mockStore(state);
        store.dispatch(updateGridSizeIfNeeded(GRID_SIZES.LG));
        expect(store.getActions()[0].type).to.eql(SET_GRID_SIZE);
        expect(store.getActions()[0].gridSize).to.eql(GRID_LG);
    });

    it('should create an action to updateGridSize to GRID_MD', () => {
        store = mockStore(state);
        store.dispatch(updateGridSizeIfNeeded(GRID_SIZES.MD));
        expect(store.getActions()[0].gridSize).to.eql(GRID_MD);
    });

    it('should create an action to updateGridSize to GRID_SM', () => {
        store = mockStore(state);
        store.dispatch(updateGridSizeIfNeeded(GRID_SIZES.SM));
        expect(store.getActions()[0].gridSize).to.eql(GRID_SM);
    });

    it('should create an action to updateGridSize to GRID_XS', () => {
        store = mockStore(state);
        store.dispatch(updateGridSizeIfNeeded(GRID_SIZES.SM - 1));
        expect(store.getActions()[0].gridSize).to.eql(GRID_XS);
    });
});
