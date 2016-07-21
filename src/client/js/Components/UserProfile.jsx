var React = require('react');
var $ = require('jquery');


var ProfileInputs = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.upperRangeInput.value,
            this.refs.lowerRangeInput.value
        );
    },

    render: function() {
        return (
            <form>
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
            </form>
        );
    }
});


var ProfileForm = React.createClass({
    loadUserDataFromServer: function() {
        $.ajax({
            url: '/api/profile/current/',
            dataType: 'json',
            cache: true,
            success: function(data) {
                this.setState({
                    data: data,
                    upper_range: data.upper_range,
                    lower_range: data.lower_range
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
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
                />
            </div>
        );
    }
});

module.exports = ProfileForm;