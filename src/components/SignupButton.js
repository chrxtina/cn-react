import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class SignupButton extends Component {

  render () {
    return (
      <button onClick={this.signupUser}>Sign up</button>
    )
  }

  signupUser = async () => {
    const { email, password, name } = this.props;

    try {
      const user = await this.props.signupUserMutation({variables: {email, password, name}});
      localStorage.setItem('graphcoolToken', user.data.signupUser.token);
      this.props.login();
      this.props.history.replace('/');
      // window.location.reload();
    } catch (e) {
      console.error(`An error occured: `, e);
      this.props.history.replace('/');
    }
  }
}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation ($email: String!, $password: String!, $name: String) {
    signupUser(email: $email, password: $password, name: $name) {
      id
      token
    }
  }
`;

export default graphql(SIGNUP_USER_MUTATION, {name: 'signupUserMutation'})(SignupButton);
