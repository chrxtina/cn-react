import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class CreateUser extends React.Component {

  constructor(props) {
    super();
    this.state = {
      email: '',
      password: '',
      name: ''
    };
  }

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
          Name:
          <input
            value={this.state.name}
            onChange={(e) => this.setState({name: e.target.value})}
          />
        </label>

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

        <button onClick={this.signupUser}>Sign up</button>
      </div>
    )
  }

  signupUser = async () => {
    const { email, password, name } = this.state;

    try {
      const user = await this.props.signupUserMutation({variables: {email, password, name}});
      localStorage.setItem('graphcoolToken', user.data.signupUser.token);
      this.props.history.replace('/');
      window.location.reload();
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

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

export default compose(
  graphql(SIGNUP_USER_MUTATION, {name: 'signupUserMutation'}),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: { fetchPolicy: 'network-only' }
  })
)(withRouter(CreateUser));
