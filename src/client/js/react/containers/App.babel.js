import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUserIfNeeded, updateUserIfNeeded } from '../actions/index.babel';
import ProfileForm from '../components/ProfileForm.babel';


class App extends Component {
    static defaultProps() {
        return {
            user: {},
            isRequesting: false,
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUserIfNeeded());
    }

    handleSubmit(new_user_data) {
        this.props.dispatch(updateUserIfNeeded(new_user_data));
    }

    render() {
        const { user } = this.props;

        return (
            <div>
                <h1>Redux App</h1>
                <ProfileForm
                    onSubmitClicked={ () => this.props.handleSubmit() }
                    user={user}
                />
            </div>
        );
    }
}

App.propTypes = {
    user: PropTypes.shape({
        upper_range: PropTypes.string,
        lower_range: PropTypes.string,
        url: PropTypes.string,
        user: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        date_of_birth: PropTypes.string,
        gender: PropTypes.string,
    }),
    isRequesting: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        isRequesting: state.isRequesting,
    };
};

export default connect(mapStateToProps)(App);
