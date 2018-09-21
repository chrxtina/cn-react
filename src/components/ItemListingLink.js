import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ItemListingLink extends Component {

  render () {

    if (this.props.item.images.length > 0 ) {
      return (
        <li>
          <img src={this.props.item.images[0].url} alt={this.props.item.name} height="50" width="50"/>
          <Link to={`${this.props.match.url}/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
        </li>
      )
    } else {
      return (
        <li>
          <Link to={`${this.props.match.url}/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
        </li>
      )
    }
  }
}

export default ItemListingLink;
