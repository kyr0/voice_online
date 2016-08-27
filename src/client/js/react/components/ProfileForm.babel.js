import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { Grid, Row, Col, Button, Form, FormControl, FormGroup, ControlLabel, Panel } from 'react-bootstrap';

export class ProfileForm extends Component {
    render() {
        const { fields: { upper_range, lower_range }, handleSubmit, doSubmit } = this.props;

        return (
            <Grid><Row><Col xs={18} md={12}>
            <Panel header="Vocal range settings">
                <Form horizontal>
                    <FormGroup bsSize="large" controlId="formHorizontalUpperRange">
                        <Col componentClass={ControlLabel} sm={2}>
                            Upper Range
                        </Col>
                        <Col sm={9}>
                            <FormControl type="text" { ...upper_range } />
                        </Col>
                    </FormGroup>

                    <FormGroup bsSize="large" controlId="formHorizontalLowerRange">
                        <Col componentClass={ControlLabel} sm={2}>
                            Lower Range
                        </Col>
                        <Col sm={9}>
                            <FormControl type="text" { ...lower_range } />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={9}>
                            <Button
                                bsStyle="info"
                                type="submit"
                                value="Save Changes"
                                onClick={handleSubmit( data => {
                                    doSubmit(data);
                                })}
                            >
                                Save
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </Panel>
            </Col></Row></Grid>
        );
    }
}

ProfileForm.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    doSubmit: PropTypes.func.isRequired,
};


const ConnectedProfileForm = reduxForm({
    form: 'profile',                            // a unique name for this form
    fields: ['upper_range', 'lower_range'],     // all the fields in your form
},
state => ({                                     // mapStateToProps
    initialValues: state.profile.user,          // will pull state into form's initialValues
}))(ProfileForm);

export default ConnectedProfileForm;
