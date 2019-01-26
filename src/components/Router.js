import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { AuthProvider, AuthConsumer } from '../context/Auth';
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

  render () {
    return (
      <div>
        <BrowserRouter>
          <AuthProvider>
            <div>
              <header>
                <AuthConsumer>
                  { ({isAuth, logout}) => (
                    <div>
                      { isAuth ? (
                        <LoggedInMenu logout={logout}/>
                      ):(
                        <LoggedOutMenu/>
                      )}
                    </div>
                  )}
                </AuthConsumer>
              </header>
              <nav className="nav-bar">
                <ul className="nav">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/category">Categories</Link></li>
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
          </AuthProvider>
        </BrowserRouter>
      </div>
    )
  }
}

export default Router;
