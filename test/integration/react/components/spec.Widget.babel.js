import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

import Widget  from '../../../../src/client/js/react/components/Widget.babel';
import { GRID_SIZES, GRID_LG } from '../../../../src/client/js/constants/constants.babel';
import {
    initialSingState,
    initialLayoutState,
    initialProfileState,
} from '../../../../src/client/js/react/reducers/reducers.babel';

chai.use(chaiEnzyme());


describe('Widget component', () => {

    let subject = null;
    let gridSize;
    let user;
    let currentLesson;
    let dummyString;
    let dummyObject;

    const mountSubject = () => {
        const props = {
            gridSize,
            user,
            currentLesson,
        };
        return mount(<Widget {...props} />);
    };

    beforeEach(() => {
        dummyString = 'does not matter';
        dummyObject = {};
        gridSize = initialLayoutState.gridSize;
        user = initialProfileState.user;
        currentLesson = initialSingState.currentLesson;
    });

    it('should create canvas if correct data available on componentDidMount()', () => {
        gridSize = GRID_LG;
        subject = mountSubject();
        expect(subject.html()).to.contain('<canvas');
    });

    it('should create canvas if correct data comes into componentReceiveProps()', () => {
        subject = mountSubject();
        subject.setProps({ gridSize: GRID_LG });
        expect(subject.html()).to.contain('<canvas');
    });
});
