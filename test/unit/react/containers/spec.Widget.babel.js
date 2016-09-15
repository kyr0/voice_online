import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

import EventEmitter from 'events';


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
    let setIsPlayingIfReady;
    let dummyString;
    let dummyObject;

    const buildSubject = () => {
        const props = {
            gridSize,
            user,
            currentLesson,
            isPlaying,
            setIsPlayingIfReady,
        };
        return shallow(<Widget {...props} />);
    };

    const mountSubject = () => {
        const props = {
            gridSize,
            user,
            currentLesson,
            isPlaying,
            setIsPlayingIfReady,
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
        setIsPlayingIfReady = sinon.stub();
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

        it('should call player.stop() first, then createPlayer() for new currentLesson', () => {
            // The order we test here prevents a scenario where the old player
            // is left playing after the new one is created

            // Arrange
            isPlaying = true;
            user = dummyObject;
            const stubPlayer = { stop: sinon.stub() };
            subject = buildSubject();
            subject.instance().player = stubPlayer;

            // Act
            subject.setProps({ isPlaying: false, currentLesson: dummyObject });

            // Assert
            expect(Widget.prototype.createPlayer).to.have.been.calledAfter(stubPlayer.stop);
        });

        it('should set isPlaying to false on endExercise event', () => {
            // Arrange
            const fakePlayer = new EventEmitter();
            subject = buildSubject();
            subject.instance().player = fakePlayer;
            subject.instance().setEndExerciseListener();
            // Act
            fakePlayer.emit('endExercise');
            // Assert
            expect(setIsPlayingIfReady).to.have.been.calledWith(false);
        });
    });


    it('should set isPlaying false and stop the Player on unmount', () => {
        isPlaying = true;
        const stubPlayer = { stop: sinon.stub() };
        subject = mountSubject();
        subject.instance().player = stubPlayer;
        subject.unmount();
        expect(setIsPlayingIfReady).to.have.been.calledAfter(stubPlayer.stop);
        expect(setIsPlayingIfReady).to.have.been.calledWith(false);
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
