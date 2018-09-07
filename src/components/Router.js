import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import App from './App';
import CategoryListing from './CategoryListing';
import NewItem from './NewItem';
import MyItemsListing from './MyItemsListing';
import CreateUser from './CreateUser';
import NotFound from './NotFound';

const Router = () => (
  <div>
    <BrowserRouter>
      <div>
        <nav className="nav-bar">
          <ul className="nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category">Categories</Link></li>
            <li><Link to="/new-item">Post Item</Link></li>
            <li><Link to="/my-items">My Items</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/category" component={CategoryListing}/>
          <Route path="/new-item" component={NewItem}/>
          <Route path='/my-items' component={MyItemsListing} />
          <Route path='/signup' component={CreateUser} />
          <Route component={NotFound}/>
        </Switch>
      </div>
    </BrowserRouter>
  </div>

);

export default Router;
