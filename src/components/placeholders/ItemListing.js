import React, { Component } from 'react';
import { Placeholder } from 'semantic-ui-react'

class ItemListing extends Component {
  renderItems = () => {
    let items = [];

    for (let i = 0; i < 10; i++) {
      items.push(
        <Placeholder key={i}>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      );
    }
    return items
  }

  render() {
    return (
      <>{this.renderItems()}</>
    )
  }
}

export default ItemListing;
