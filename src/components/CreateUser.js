import React from 'react';
import { withRouter } from 'react-router-dom';
import { AuthConsumer } from '../context/Auth';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SignupButton from './SignupButton';

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

        <AuthConsumer>
          {({login}) => (
            <SignupButton {...this.props} name={this.state.name} email={this.state.email} password={this.state.password} login={login}/>
          )}
        </AuthConsumer>
      </div>
    )
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

export default graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery',
  options: { fetchPolicy: 'network-only' }
})(withRouter(CreateUser));
