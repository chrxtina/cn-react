import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class LoginButton extends Component {

  render () {
    return (
        <button onClick={this.authenticateUser}>Log in</button>
    )
  }

  authenticateUser = async () => {
    const {email, password} = this.props;

    const response = await this.props.authenticateUserMutation({variables: {email, password}});
    localStorage.setItem('graphcoolToken', response.data.authenticateUser.token);
    this.props.login();
    this.props.history.replace('/');
    // window.location.reload();
  }
}

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation ($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      token
    }
  }
`;

export default graphql(AUTHENTICATE_USER_MUTATION, {name: 'authenticateUserMutation'})(LoginButton);
