import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

import { Widget } from '../../../../src/client/js/react/containers/Widget.babel';
import { GRID_LG } from '../../../../src/client/js/constants/constants.babel';
import {
    initialSingState,
    initialLayoutState,
    initialProfileState,
} from '../../../../src/client/js/react/reducers/reducers.babel';

chai.use(chaiEnzyme());


describe('Widget container', () => {

    let subject = null;
    let sandbox;
    let gridSize;
    let user;
    let currentLesson;
    let isPlaying;
    let dummyString;
    let dummyObject;

    const buildSubject = () => {
        const props = {
            gridSize,
            user,
            currentLesson,
            isPlaying,
        };
        return shallow(<Widget {...props} />);
    };

    const mountSubject = () => {
        const props = {
            gridSize,
            user,
            currentLesson,
            isPlaying,
        };
        return mount(<Widget {...props} />);
    };

    beforeEach(() => {
        dummyString = 'does not matter';
        dummyObject = {};
        gridSize = initialLayoutState.gridSize;
        user = initialProfileState.user;
        currentLesson = initialSingState.currentLesson;
        isPlaying = initialSingState.isPlaying;
    });

    describe('', () => {

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(Widget.prototype, 'setCanvasWidth');
            sandbox.stub(Widget.prototype, 'createPlayer');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should update canvas.width when appropriate nextProp', () => {
            subject = buildSubject();
            subject.setProps({ gridSize: dummyString });
            expect(Widget.prototype.setCanvasWidth).to.have.been.calledOnce;
            expect(Widget.prototype.createPlayer).not.to.have.been.called;
        });

        it('should not cal createPlayer or setCanvasWidth on user update only', () => {
            subject = buildSubject();
            subject.setProps({ user: dummyObject });
            expect(Widget.prototype.setCanvasWidth).not.to.have.been.called;
            expect(Widget.prototype.createPlayer).not.to.have.been.called;
        });

        it('should not cal createPlayer or setCanvasWidth on lesson update only', () => {
            subject = buildSubject();
            subject.setProps({ currentLesson: dummyObject });
            expect(Widget.prototype.setCanvasWidth).not.to.have.been.called;
            expect(Widget.prototype.createPlayer).not.to.have.been.called;
        });

        it('should call createPlayer when user and currentLesson have both been updated', () => {
            subject = buildSubject();
            subject.setProps({ user: dummyObject, currentLesson: dummyObject });
            expect(Widget.prototype.createPlayer).to.have.been.calledOnce;
        });

        it('should not call canvas updates with initial state on componentDidMount', () => {
            subject = mountSubject();
            expect(Widget.prototype.setCanvasWidth).not.to.have.been.called;
            expect(Widget.prototype.createPlayer).not.to.have.been.called;
        });

        it('should call all canvas updates if correct updated state on componentDidMount', () => {
            gridSize = dummyString;
            user = dummyObject;
            currentLesson = dummyObject;
            subject = mountSubject();
            expect(Widget.prototype.setCanvasWidth).to.have.been.calledOnce;
            expect(Widget.prototype.createPlayer).to.have.been.calledOnce;
        });
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
