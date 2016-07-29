var React = require('react');
var _ = require('lodash');

var axios = require('../lib/helpers').axios;

var ProfileInputs = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.upperRangeInput.value,
            this.refs.lowerRangeInput.value
        );
    },

    handleSubmit: function(event) {
        event.preventDefault();
        this.props.onProfileSubmit();
    },

    render: function() {
        return (
            <form className="profileForm" onSubmit={this.handleSubmit}>
                Upper Range:
                <input
                    type="text"
                    size="13"
                    value={this.props.upper_range}
                    ref="upperRangeInput"
                    onChange={this.handleChange}
                />
                Lower Range:
                <input
                    id="lower_range"
                    type="text"
                    size="13"
                    value={this.props.lower_range}
                    ref="lowerRangeInput"
                    onChange={this.handleChange}
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
});


var ProfileForm = React.createClass({
    loadUserDataFromServer: function() {
        axios('/api/profile/current/')
            .then(function(response) {
                this.setState({
                    data: response.data,
                    upper_range: response.data.upper_range,
                    lower_range: response.data.lower_range
                });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    },
    getInitialState: function() {
        return {
            upper_range: null,
            lower_range: null
        };
    },

    handleUserInput: function(upper_range, lower_range) {
        this.setState({
            upper_range: upper_range,
            lower_range: lower_range
        });
    },

    handleProfileSubmit: function() {
        var new_upper_range = this.state.upper_range.trim();
        var new_lower_range = this.state.lower_range.trim();
        // TODO Add input validation - maybe validation should go in the form itself tho, not sure
        axios.put('/api/profile/current/', {
            upper_range: new_upper_range,
            lower_range: new_lower_range,
        })
            .then(function(response) {
                this.setState({
                    data: response.data
                });
            }.bind(this))
            .catch(function (error) {
                console.log('Error', error.message);
            });
    },

    componentDidMount: function() {
        this.loadUserDataFromServer();
    },

    render: function() {
        return (
            <div className="profileForm">
                <h1>Profile</h1>
                <p>{JSON.stringify(this.state.data)}</p>
                <ProfileInputs
                    upper_range={this.state.upper_range}
                    lower_range={this.state.lower_range}
                    onUserInput={this.handleUserInput}
                    onProfileSubmit={this.handleProfileSubmit}
                />
            </div>
        );
    }
});


export default React.createClass({
    render: function() {
        return (
            <div>
                <ProfileForm />
            </div>
        );
    }
});
