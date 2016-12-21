import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { Button, Form, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

export class LoginForm extends Component {
    render() {
        const { handleSubmit, doSubmit } = this.props;

        return (
            <Form>
                <FormGroup>
                    <ControlLabel>Username</ControlLabel>
                    {' '}
                    <FormControl type="text" />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    {' '}
                    <FormControl type="password" />
                </FormGroup>
                <Button
                    type="submit"
                    onClick={handleSubmit( data => {
                        doSubmit(data);
                    })}
                >
                    Login
                </Button>
            </Form>
        );
    }
}

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    doSubmit: PropTypes.func.isRequired,
};


const ConnectedLoginForm = reduxForm({
    form: 'login',                            // a unique name for this form
    fields: ['username', 'password'],     // all the fields in your form
})(LoginForm);

export default ConnectedLoginForm;
