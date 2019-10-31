import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class LoggedOutMenu extends Component {
  render () {
    return (
      <nav className="main-menu">
        <ul className="nav">
          <li>
            <NavLink
              to="/login"
              activeClassName="hide"
              onClick={this.props.toggleNav}>
              Log In
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signup"
              activeClassName="hide"
              onClick={this.props.toggleNav}>
              Sign Up
            </NavLink>
          </li>
        </ul>
      </nav>
    )
  }
}

export default LoggedOutMenu;
