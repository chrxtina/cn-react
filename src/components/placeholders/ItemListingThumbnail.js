import React, { Component } from 'react';
import { Placeholder } from 'semantic-ui-react';

class ItemListingThumbnail extends Component {
  renderItems = () => {
    let items = [];

    for (let i = 0; i < 10; i++) {
      items.push(
        <Placeholder key={i}>
          <Placeholder.Header image>
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

export default ItemListingThumbnail;
