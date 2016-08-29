import { GRID_LG, GRID_MD, GRID_SM, GRID_XS } from '../../constants/constants.babel';

export const SET_GRID_SIZE = 'SET_GRID_SIZE';

const GRID_SIZES = {
    LG: 1200,
    MD: 992,
    SM: 768,
};


function getActualGridSize(windowSize) {
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


export function updateGridSizeIfNeeded(windowSize) {
    const actualGridSize = getActualGridSize(windowSize);
    return getState => {
        if (getState().gridSize != actualGridSize) {
            return {
                type: SET_GRID_SIZE,
                gridSize: actualGridSize,
            };
        }
    };
}
