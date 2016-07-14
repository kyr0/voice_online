var React = require('react');
var $ = require('jquery');


var RangeInput = React.createClass({
    handleChange: function(event) {
        this.setProps({value: event.target.value});
    },
    render: function() {
        return (
            <form>
                {this.props.label}
                <input
                    type="text"
                    size="13"
                    value={JSON.stringify(this.props.value)}
                    onChange={this.handleChange}
                />
            </form>
        );
    }
});


var ProfileForm = React.createClass({
    loadUserDataFromServer: function() {
        $.ajax({
            url: '/api/user/current/',
            dataType: 'json',
            cache: true,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: {"upper_range": null, "lower_range": null}};
    },
    componentDidMount: function() {
        this.loadUserDataFromServer();
    },
    render: function() {
        return (
            <div className="profileForm">
                <h1>Profile</h1>
                <p>{JSON.stringify(this.state.data)}</p>
                <RangeInput id="upper_range" label="Upper Range" value={this.state.data.upper_range}/>
                <RangeInput id="lower_range" label="Lower Range" value={this.state.data.lower_range}/>
            </div>
        );
    }
});

module.exports = ProfileForm;