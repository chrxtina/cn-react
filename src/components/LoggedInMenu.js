import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LoggedInMenu extends Component {
  _logout = () => {
    // remove token from local storage and reload page to reset apollo client
    localStorage.removeItem('graphcoolToken');
    window.location.reload();
  }

  render () {
    return (
      <div>
          <li><Link to="/new-item">Post Item</Link></li>
          <li><Link to="/my-items">My Items</Link></li>
          <li onClick={this._logout}>Logout</li>
      </div>
    )
  }
}

export default LoggedInMenu;
