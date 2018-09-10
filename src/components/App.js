import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LoggedInMenu from './LoggedInMenu';
import LoggedOutMenu from './LoggedOutMenu';

class App extends Component {

  render () {
    return (
      <div>
        Home
      </div>
    )
  }
}

export default App;
