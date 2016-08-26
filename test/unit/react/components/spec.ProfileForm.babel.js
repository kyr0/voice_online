import { ProfileForm } from '../../../../src/client/js/react/components/ProfileForm.babel';
import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());


describe('ProfileForm component', () => {

    let subject = null;
    let doSubmit;

    const buildSubject = () => {
        const props = {
            doSubmit,
            fields: {
                upper_range: {
                    value: '',
                },
                lower_range: {
                    value: '',
                },
            },
            handleSubmit: fn => fn,
        };
        return shallow(<ProfileForm {...props} />);
    };



    beforeEach(() => {
        doSubmit = sinon.stub();
    });

    it('calls doSubmit after clicking submit button', () => {
        subject = buildSubject();
        subject.find('Button[type="submit"]').simulate('click');
        expect(doSubmit.callCount).to.equal(1);
    });
});
