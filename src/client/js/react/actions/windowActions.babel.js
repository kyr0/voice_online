import { GRID_LG, GRID_MD, GRID_SM, GRID_XS, GRID_SIZES } from '../../constants/constants.babel';

export const SET_GRID_SIZE = 'SET_GRID_SIZE';


function getProposedGridSize(windowSize) {
    if (windowSize < GRID_SIZES.SM) {
        return GRID_XS;
    } else if (windowSize < GRID_SIZES.MD) {
        return GRID_SM;
    } else if (windowSize < GRID_SIZES.LG) {
        return GRID_MD;
    } else if (windowSize >= GRID_SIZES.LG) {
        return GRID_LG;
    } else {
        return null;
    }
}


function getWindowWidth() {
    let w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0];
    return w.innerWidth || documentElement.clientWidth || body.clientWidth;
}


function updateGridSize(newGridSize) {
    return {
        type: SET_GRID_SIZE,
        gridSize: newGridSize,
    };
}


export function updateGridSizeIfNeeded(width = getWindowWidth()) {
    const newGridSize = getProposedGridSize(width);
    return (dispatch, getState) =>  {
        if (getState().layout.gridSize !== newGridSize) {
            dispatch(updateGridSize(newGridSize));
        }
    };
}
