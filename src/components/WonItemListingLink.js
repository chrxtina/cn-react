import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class WonItemListingLink extends Component {

  render () {

    if (this.props.item.images.length > 0 ) {
      return (
        <li>
          <img src={this.props.item.images[0].url} alt={this.props.item.name} className="item-thumbnail"/>
          <Link to={`/item/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
        </li>
      )
    } else {
      return (
        <li>
          <Link to={`/item/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
        </li>
      )
    }
  }
}

export default WonItemListingLink;
