import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

import EventEmitter from 'events';


import { Canvas as CanvasClass } from '../../../../src/client/js/Canvas.babel';
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
    let instrumentBuffers;
    let setIsPlayingIfReady;
    let dummyString;
    let dummyObject;
    let Canvas;
    let Audio;
    let User;
    let Lesson;
    let Player;

    const shallowSubject = () => {
        const props = {
            gridSize,
            user,
            currentLesson,
            isPlaying,
            instrumentBuffers,
            setIsPlayingIfReady,
            Canvas,
            Audio,
            User,
            Lesson,
            Player,
        };
        return shallow(<Widget {...props} />);
    };

    const mountSubject = () => {
        const props = {
            gridSize,
            user,
            currentLesson,
            isPlaying,
            instrumentBuffers,
            setIsPlayingIfReady,
            Canvas,
            Audio,
            User,
            Lesson,
            Player,
        };
        return mount(<Widget {...props} />);
    };

    beforeEach(() => {
        dummyString = 'does not matter';
        dummyObject = { dummy: 'object' };
        gridSize = initialLayoutState.gridSize;
        user = initialProfileState.user;
        currentLesson = initialSingState.currentLesson;
        isPlaying = initialSingState.isPlaying;
        instrumentBuffers = initialSingState.instrumentBuffers;
        setIsPlayingIfReady = sinon.stub();
        Canvas = function () {
            this.setWidth = function () {};
            this.setPlayer = function () {};
        };
        Audio = function () {
            this.bufferToggle = 0;
            this.setPlayer = function () {};
            this.setInstrumentBuffers = function () {
                this.bufferToggle++;
            };
        };
        User = function () {};
        Lesson = function () {};
        Player = function () {};
    });

    describe('', () => {

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(Widget.prototype, 'createCanvas');
            sandbox.stub(Widget.prototype, 'createPlayer');
            sandbox.stub(Widget.prototype, 'setEndExerciseListener');
        });

        afterEach(() => {
            sandbox.restore();
        });


        it('should not attempt to set instrument buffers on mount unless they already exist', () => {
            subject = mountSubject();
            expect(subject.instance().audio.bufferToggle).to.eql(0);
        });

        it('should set instrument buffers on mount if they already exist', () => {
            instrumentBuffers = dummyObject;
            subject = mountSubject();
            expect(subject.instance().audio.bufferToggle).to.eql(1);
        });

        it('should not try to set instrument buffers on prop update unless they are new buffers', () => {
            subject = mountSubject();
            subject.setProps({ gridSize: dummyString });
            expect(subject.instance().audio.bufferToggle).to.eql(0);
        });

        it('should set instrument buffers on prop update if they are new buffers', () => {
            subject = mountSubject();
            subject.setProps({ instrumentBuffers: dummyObject });
            expect(subject.instance().audio.bufferToggle).to.eql(1);
        });

        it('should update canvas.width when appropriate nextProp', () => {
            subject = shallowSubject();
            subject.setProps({ gridSize: dummyString });
            expect(Widget.prototype.createCanvas).to.have.been.calledOnce;
            expect(Widget.prototype.createPlayer).to.have.been.calledWith(initialProfileState.user, initialSingState.currentLesson);
        });

        it('should not call setEndExerciseListener on user update only', () => {
            Widget.prototype.createCanvas.restore();
            Widget.prototype.createPlayer.restore();
            subject = shallowSubject();
            subject.setProps({ user: dummyObject });
            expect(Widget.prototype.setEndExerciseListener).not.to.have.been.called;
        });

        it('should not call setEndExerciseListener on lesson update only', () => {
            Widget.prototype.createCanvas.restore();
            Widget.prototype.createPlayer.restore();
            subject = shallowSubject();
            subject.setProps({ currentLesson: dummyObject });
            expect(Widget.prototype.setEndExerciseListener).not.to.have.been.called;
        });

        it('should call setEndExerciseListener when user and currentLesson have both been updated', () => {
            Widget.prototype.createCanvas.restore();
            Widget.prototype.createPlayer.restore();
            let dummyLesson = { notes: [{ duration: '1/8', name: 'A4' }] };
            subject = mountSubject();
            subject.setProps({ currentLesson: dummyLesson });
            subject.setProps({ user: { lower_range: 'A4', upper_range: 'A5' } });
            expect(Widget.prototype.setEndExerciseListener).to.have.been.calledOnce;
        });

        it('should call createCanvas but not createPlayer with initial state on componentDidMount', () => {
            subject = mountSubject();
            expect(Widget.prototype.createCanvas).to.have.been.calledOnce;
            expect(Widget.prototype.createPlayer).not.to.have.been.called;
        });

        it('should call all canvas updates if correct updated state on componentDidMount', () => {
            gridSize = dummyString;
            user = dummyObject;
            currentLesson = dummyObject;
            subject = mountSubject();
            expect(Widget.prototype.createCanvas).to.have.been.calledOnce;
            expect(Widget.prototype.createPlayer).to.have.been.calledOnce;
        });

        it('should both resize and redraw lesson if user and lesson present during resize', () => {
            user = dummyObject;
            currentLesson = dummyObject;
            subject = mountSubject();  // spies are called during mount
            subject.setProps({ gridSize: dummyString });
            expect(Widget.prototype.createCanvas).to.have.been.calledTwice;
            expect(Widget.prototype.createPlayer).to.have.been.calledTwice;
        });

        it('should call player.stop() first, then createPlayer() for new currentLesson', () => {
            // The order we test here prevents a scenario where the old player
            // is left playing after the new one is created

            // Arrange
            isPlaying = true;
            user = dummyObject;
            const stubPlayer = { stop: sinon.stub() };
            subject = shallowSubject();
            subject.instance().player = stubPlayer;

            // Act
            subject.setProps({ isPlaying: false, currentLesson: dummyObject });

            // Assert
            expect(Widget.prototype.createPlayer).to.have.been.calledAfter(stubPlayer.stop);
        });

        it('should set isPlaying to false on endExercise event', () => {
            // Arrange
            Widget.prototype.setEndExerciseListener.restore();
            const fakePlayer = new EventEmitter();
            subject = shallowSubject();
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
        Canvas = CanvasClass;
        gridSize = GRID_LG;
        subject = mountSubject();
        expect(subject.html()).to.contain('<canvas');
    });

    it('should create canvas if correct data comes into componentReceiveProps()', () => {
        Canvas = CanvasClass;
        subject = mountSubject();
        subject.setProps({ gridSize: GRID_LG });
        expect(subject.html()).to.contain('<canvas');
    });
});
