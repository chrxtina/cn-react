import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
        <div>Welcome, {User.name}</div>
        <ul>
          <li><Link to="/new-item">Post Item</Link></li>
          <li><Link to="/my-items">My Items</Link></li>
          <li><Link to="/won-items">My Won Items</Link></li>
          <li><Link to="/messages">Messages</Link></li>
          <li onClick={this.props.logout}>Logout</li>
        </ul>
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
