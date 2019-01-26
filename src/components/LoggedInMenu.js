import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LoggedInMenu extends Component {
  
  render () {
    return (
      <div>
          <li><Link to="/new-item">Post Item</Link></li>
          <li><Link to="/my-items">My Items</Link></li>
          <li onClick={this.props.logout}>Logout</li>
      </div>
    )
  }
}

export default LoggedInMenu;
