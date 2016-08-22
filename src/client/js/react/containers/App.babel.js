import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUserIfNeeded, updateUserIfNeeded } from '../actions/actions.babel';
import ProfileForm from '../components/ProfileForm.babel';


class App extends Component {

    handleSubmit(new_user_data) {
        // this.props.dispatch(updateUserIfNeeded(new_user_data));
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUserIfNeeded());
    }

    render() {
        return (
            <div>
                <h1>Redux App</h1>
                {/*<ProfileForm onSubmit={ this.handleSubmit.bind(this) }/>*/}
            </div>
        );
    }
}


App.propTypes = {
    user: PropTypes.object,
    isRequesting: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        isRequesting: state.isRequesting,
    };
};

export default connect(mapStateToProps)(App);
