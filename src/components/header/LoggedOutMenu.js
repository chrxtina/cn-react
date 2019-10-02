import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LoggedOutMenu extends Component {
  render () {
    return (
      <nav className="main-menu">
        <ul>
          <li><Link to="/login">Log In</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>
      </nav>
    )
  }
}

export default LoggedOutMenu;
