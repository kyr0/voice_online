import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { Button } from 'react-bootstrap';

export class ProfileForm extends Component {
    render() {
        const { fields: { upper_range, lower_range }, handleSubmit, doSubmit } = this.props;

        return (
            <form>
                <label>Upper Range</label>
                <input
                    type="text"
                    size="13"
                    { ...upper_range }
                />
                <label>Lower Range</label>
                <input
                    type="text"
                    size="13"
                    { ...lower_range }
                />
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
            </form>
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
