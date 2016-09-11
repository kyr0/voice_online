import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

import SingPage from '../../../../src/client/js/react/components/SingPage.babel';
import { initialSingState } from '../../../../src/client/js/react/reducers/reducers.babel';


describe('SingPage component', () => {

    let subject = null;
    let lessons;
    let currentLesson;
    let isPlaying;
    let doLessonSelect;
    let doPreviousLessonSelect;
    let doNextLessonSelect;
    let doPlayLessonSelect;

    const buildSubject = () => {
        const props = {
            lessons,
            currentLesson,
            isPlaying,
            doLessonSelect,
            doPreviousLessonSelect,
            doNextLessonSelect,
            doPlayLessonSelect,
        };
        return shallow(<SingPage{...props} />);
    };

    beforeEach(() => {
        lessons = initialSingState.lessons.results;
        currentLesson = initialSingState.currentLesson;
        isPlaying = initialSingState.isPlaying;
        doLessonSelect = fn => fn;
        doPreviousLessonSelect = sinon.stub();
        doNextLessonSelect = sinon.stub();
        doPlayLessonSelect = sinon.stub();
    });

    it('has different image asset depending on isPlaying state', () => {
        subject = buildSubject();
        const img = subject.find('Image').at(1);
        expect(img.prop('src')).to.contain('play');
    });

    it('has different image asset depending on isPlaying state', () => {
        isPlaying = !isPlaying;
        subject = buildSubject();
        const img = subject.find('Image').at(1);
        expect(img.prop('src')).to.contain('stop');
    });

    it('calls doPlayLessonSelect on click', () => {
        subject = buildSubject();
        subject.find('Button').at(1).simulate('click');
        expect(doPlayLessonSelect.callCount).to.equal(1);
    });

    it('calls doPreviousLessonSelect on click', () => {
        subject = buildSubject();
        subject.find('Button').at(0).simulate('click');
        expect(doPreviousLessonSelect.callCount).to.equal(1);
    });

    it('calls doNextLessonSelect on click', () => {
        subject = buildSubject();
        subject.find('Button').at(2).simulate('click');
        expect(doNextLessonSelect.callCount).to.equal(1);
    });
});
