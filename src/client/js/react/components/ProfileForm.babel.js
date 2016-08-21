import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

class ProfileForm extends Component {
    render() {
        const { fields: { upper_range, lower_range }, onSubmitClicked } = this.props;

        return (
            <form onSubmit={onSubmitClicked}>
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
                <button
                    type="submit"
                    value="Save Changes"
                    onclick="return false"
                />
            </form>
        );
    }
}

ProfileForm.propTypes = {
    fields: PropTypes.object.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
};

ProfileForm = reduxForm({
    form: 'profile',                           // a unique name for this form
    fields: ['upper_range', 'lower_range'],    // all the fields in your form
},
state => ({                     // mapStateToProps
    initialValues: state.user,  // will pull state into form's initialValues
}))(ProfileForm);

export default ProfileForm;