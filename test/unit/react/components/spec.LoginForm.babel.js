import { LoginForm } from '../../../../src/client/js/react/components/LoginForm.babel';
import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());


describe('LoginForm component', () => {

    let subject = null;
    let doSubmit;

    const buildSubject = () => {
        const props = {
            doSubmit,
            fields: {
                username: {
                    value: '',
                },
                password: {
                    value: '',
                },
            },
            handleSubmit: fn => fn,
        };
        return shallow(<LoginForm {...props} />);
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
