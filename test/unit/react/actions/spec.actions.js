import {
    GET_USER_REQUEST
} from '../../../../src/client/js/react/actions/index'

describe('actions', () => {
    it('should create an action to GET user request', () => {
        const expectedAction = {
            type: GET_USER_REQUEST
        };
        expect("RAWR").toEqual(expectedAction)
    })
})