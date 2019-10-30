import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { AuthConsumer } from '../../context/Auth';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import LoginButton from './LoginButton';

class CreateLogin extends Component {

  state = {
    email: '',
    password: '',
  };

  render () {
    if (this.props.loggedInUserQuery.loading) {
      return (<div className="wrap-sm"><span className="content-sm">Loading</span></div>)
    }

    // redirect if user is logged in
    if (this.props.loggedInUserQuery.loggedInUser.id) {
      console.warn('Already logged in');
      this.props.history.replace('/');
    }

    return (
      <div className="login-signup">
        <div className="form-card content content-sm">
          <label>
            <input
              value={this.state.email}
              placeholder="Email Address"
              onChange={(e) => this.setState({email: e.target.value})}
            />
          </label>
          <label>
            <input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={(e) => this.setState({password: e.target.value})}
            />
          </label>

          <AuthConsumer>
            {({login}) => (
              <LoginButton {...this.props} email={this.state.email} password={this.state.password} login={login}/>
            )}
          </AuthConsumer>
        </div>
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
})(withRouter(CreateLogin));
