import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import App from './App';
import CategoryListing from './CategoryListing';
import NotFound from './NotFound';

const Router = () => (
  <div>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/category" component={CategoryListing}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  </div>

);

export default Router;
