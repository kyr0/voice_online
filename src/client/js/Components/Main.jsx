import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
    render() {
        return (
            <div>
                <h1>Pure Voice</h1>
                <ul role="nav">
                    <li><Link to="/sing">Sing</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
});
