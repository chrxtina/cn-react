import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { AuthProvider, AuthConsumer } from '../context/Auth';
import Home from './home/Home';
import ProtectedRoute from './ProtectedRoute';
import ItemDetails from './ItemDetails';
import NewItem from './NewItem';
import MyItemsListing from './MyItemsListing';
import WonItemsListing from './WonItemsListing';
import Conversations from './Conversations';
import LoginUser from './login-signup/LoginUser';
import CreateUser from './login-signup/CreateUser';
import NotFound from './NotFound';
import LoggedInMenu from './header/LoggedInMenu';
import LoggedOutMenu from './header/LoggedOutMenu';

class Router extends Component {

  render () {
    return (
      <>
        <BrowserRouter>
          <AuthProvider>
              <header className="header">
                <div className="logo"><Link to="/">Bonaber</Link></div>
                <div className="header-menu">
                  <AuthConsumer>
                    { ({isAuth, logout}) => (
                      isAuth ? (
                        <LoggedInMenu logout={logout}/>
                      ):(
                        <LoggedOutMenu/>
                      )
                    )}
                  </AuthConsumer>
                </div>
              </header>

              <main>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/item/:itemId" component={ItemDetails}/>
                  <ProtectedRoute path="/new-item" component={NewItem}/>
                  <ProtectedRoute path="/my-items" component={MyItemsListing} />
                  <ProtectedRoute path="/won-items" component={WonItemsListing} />
                  <ProtectedRoute path="/messages" component={Conversations} />
                  <Route path="/signup" component={CreateUser} />
                  <Route path="/login" component={LoginUser} />
                  <Route component={NotFound}/>
                </Switch>
              </main>
          </AuthProvider>
        </BrowserRouter>
      </>
    )
  }
}

export default Router;
