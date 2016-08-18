import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getUserIfNeeded, updateUserIfNeeded } from '../actions/index.babel'
import Profile from '../components/Profile.babel'
// import Practice from '../components/Practice'


class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getUserIfNeeded())
    }

    handleChange(updated_user) {
        this.props.dispatch(updateUserIfNeeded(updated_user))
    }

    render() {
        const { user } = this.props;
        return (
            <div>
                <Profile value={user} onChange={this.handleChange} />
            </div>
        )
    }
}


App.propTypes = {
    user: PropTypes.object.isRequired,
    isRequesting: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
};


function mapStateToProps(state) {
    const { user } = state;
    const { isRequesting } = postsByReddit[selectedReddit] || {
        isRequesting: true,
        items: []
    };

    return {
        user,
        isRequesting,
    }
}

export default connect(mapStateToProps)(App)
