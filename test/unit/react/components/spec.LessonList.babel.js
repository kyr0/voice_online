import LessonList  from '../../../../src/client/js/react/components/LessonList.babel';
import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

import { initialSingState, initialProfileState } from '../../../../src/client/js/react/reducers/reducers.babel';

chai.use(chaiEnzyme());


describe('ProfileForm component', () => {

    let subject = null;
    let doLessonSelect;
    let user = initialProfileState.user;
    let lessons =  [{ title: 'one' }, { title: 'two' }, { title: 'three' }];
    let currentLesson = initialSingState.currentLesson;

    const buildSubject = () => {
        const props = {
            user,
            doLessonSelect,
            lessons,
            currentLesson,
        };
        return shallow(<LessonList {...props} />);
    };


    beforeEach(() => {
        doLessonSelect = sinon.stub();
    });

    it('calls doLessonSelect after selecting a lesson', () => {
        subject = buildSubject();
        const letGroupItems = subject.find('ListGroupItem');
        expect(letGroupItems).to.have.length(lessons.length);
        letGroupItems.at(1).simulate('click');
        expect(doLessonSelect.callCount).to.equal(1);
    });

    it('sets the Panel header to the currentLesson', () => {
        subject = buildSubject();
        subject.setProps({ currentLesson: { title: 'new' } });
        expect(subject.find('Panel').prop('header')).to.equal('new');
    });


});
