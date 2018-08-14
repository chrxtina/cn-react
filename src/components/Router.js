import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CategoryListing from './CategoryListing';
import NotFound from './NotFound';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={CategoryListing}/>
      <Route component={NotFound}/>
    </Switch>
  </BrowserRouter>
);

export default Router;
