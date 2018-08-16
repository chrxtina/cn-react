import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import CategoryListing from './CategoryListing';

class App extends Component {
  render() {
    return (
      <div className="App">
        Welcome
        <nav className="navbar">
          <ul className="nav">
            <li><Link to="/category">Categories</Link></li>
          </ul>
        </nav>
        <Route path="/category" component={CategoryListing}/>
      </div>
    );
  }
}

export default App;
