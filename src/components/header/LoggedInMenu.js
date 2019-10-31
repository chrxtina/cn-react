import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class LoggedInMenu extends Component {

  render () {
    if (this.props.loggedInUserQuery.loading) {
      return (
        <div>
          Loading
        </div>
      )
    }

    const User = this.props.loggedInUserQuery.loggedInUser;

    return (
      <>
        <div className="welcome">Welcome, {User.name}</div>
        <nav className="main-menu">
          <ul className="nav">
            <li>
              <NavLink
                onClick={this.props.toggleNav}
                activeClassName="active"
                to="/new-item">
                Post Item
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={this.props.toggleNav}
                activeClassName="active"
                to="/my-items">
                My Items
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={this.props.toggleNav}
                activeClassName="active"
                to="/won-items">
                My Won Items
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={this.props.toggleNav}
                activeClassName="active"
                to="/messages">
                Messages
              </NavLink>
            </li>
            <li onClick={this.props.logout}>
              Logout
            </li>
          </ul>
        </nav>
      </>
    )
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
      name
    }
  }
`;

export default graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery'
})(LoggedInMenu);
