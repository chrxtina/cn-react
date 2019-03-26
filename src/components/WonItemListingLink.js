import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class WonItemListingLink extends Component {

  render () {

    if (this.props.item.images.length > 0 ) {
      return (
        <li>
          <img src={this.props.item.images[0].url} alt={this.props.item.name} className="item-thumbnail"/>
          <Link to={`category/${this.props.item.category.name}/${this.props.item.category.id}/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
        </li>
      )
    } else {
      return (
        <li>
          <Link to={`category/${this.props.item.category.name}/${this.props.item.category.id}/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
        </li>
      )
    }
  }
}

export default WonItemListingLink;
