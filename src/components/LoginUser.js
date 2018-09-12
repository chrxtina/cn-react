import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class CreateLogin extends Component {

  state = {
    email: '',
    password: '',
  };

  render () {
    if (this.props.loggedInUserQuery.loading) {
      return (<div>Loading</div>)
    }

    // redirect if user is logged in
    if (this.props.loggedInUserQuery.loggedInUser.id) {
      console.warn('Already logged in');
      this.props.history.replace('/');
    }

    return (
      <div>
        <label>
          Email:
          <input
            value={this.state.email}
            onChange={(e) => this.setState({email: e.target.value})}
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            value={this.state.password}
            onChange={(e) => this.setState({password: e.target.value})}
          />
        </label>

        <button onClick={this.authenticateUser}>Log in</button>
      </div>
    )
  }

  authenticateUser = async () => {
    const {email, password} = this.state;

    const response = await this.props.authenticateUserMutation({variables: {email, password}});
    localStorage.setItem('graphcoolToken', response.data.authenticateUser.token);
    this.props.history.replace('/');
    window.location.reload();
  }
}

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation ($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      token
    }
  }
`;

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

export default compose(
  graphql(AUTHENTICATE_USER_MUTATION, {name: 'authenticateUserMutation'}),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: { fetchPolicy: 'network-only' }
  })
)(withRouter(CreateLogin));
