import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LoggedOutMenu extends Component {
  render () {
    return (
      <div>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/login">Log In</Link></li>
      </div>
    )
  }
}

export default LoggedOutMenu;
