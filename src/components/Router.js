import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import App from './App';
import CategoryListing from './CategoryListing';
import NewItem from './NewItem';
import MyItemsListing from './MyItemsListing';
import LoginUser from './LoginUser';
import CreateUser from './CreateUser';
import NotFound from './NotFound';
import LoggedInMenu from './LoggedInMenu';
import LoggedOutMenu from './LoggedOutMenu';

class Router extends Component {

  _isLoggedIn = () => {
    return this.props.loggedInUserQuery.loggedInUser && this.props.loggedInUserQuery.loggedInUser.id !== null
  }

  render () {
    if (this.props.loggedInUserQuery.loading) {
      return (<div>Loading</div>)
    }

    let menuItems;
    if (this._isLoggedIn()) {
      menuItems = <LoggedInMenu />;
    } else {
      menuItems = <LoggedOutMenu />;
    }

    return (
      <div>
        <BrowserRouter>
          <div>
            <nav className="nav-bar">
              <ul className="nav">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/category">Categories</Link></li>
                { menuItems }
              </ul>
            </nav>
            <Switch>
              <Route exact path="/" component={App} />
              <Route path="/category" component={CategoryListing}/>
              <Route path="/new-item" component={NewItem}/>
              <Route path='/my-items' component={MyItemsListing} />
              <Route path='/signup' component={CreateUser} />
              <Route path='/login' component={LoginUser} />
              <Route component={NotFound}/>
            </Switch>
          </div>
        </BrowserRouter>
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

const RouterWithQuery = compose(
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(Router);

export default RouterWithQuery;
