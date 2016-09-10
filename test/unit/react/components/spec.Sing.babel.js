import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

import { Sing } from '../../../../src/client/js/react/containers/Sing.babel';
import {
    initialSingState,
} from '../../../../src/client/js/react/reducers/reducers.babel';

chai.use(chaiEnzyme());


describe('Sing container', () => {

    let subject = null;
    let sandbox;
    let lessons;
    let currentLesson;
    let isPlaying;
    let dispatch;
    let dummyString;
    let dummyObject;

    const buildSubject = () => {
        const props = {
            lessons,
            currentLesson,
            isPlaying,
            dispatch,
        };
        return shallow(<Sing {...props} />);
    };

    beforeEach(() => {
        dummyString = 'does not matter';
        dummyObject = {};
        lessons = initialSingState.lessons.results;
        currentLesson = initialSingState.currentLesson;
        isPlaying = initialSingState.isPlaying;
        dispatch = () => {};
        sandbox = sinon.sandbox.create();
        sandbox.stub(window, 'addEventListener');
        sandbox.stub(window, 'removeEventListener');
        sandbox.stub(Sing.prototype, 'handleResize');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should attempt to create an event listener on mount', () => {
        subject = buildSubject();
        expect(Sing.prototype.handleResize).to.have.been.calledOnce;
        expect(window.addEventListener).to.have.been.calledOnce;
    });

    it('should remove the event listener on unmount', () => {
        subject = buildSubject();
        subject.unmount();
        expect(window.removeEventListener).to.have.been.calledOnce;
    });
});
