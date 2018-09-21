import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class ItemDetails extends Component {
  render() {

    if (this.props.itemQuery.loading) {
      return (
        <div>
          Loading
        </div>
      )
    }

    const { Item } = this.props.itemQuery;

    return (
      <div>
        <div>
          {Item.name}
        </div>
        <div>
          {Item.images.map( image => (
            <img src={image.url} key={image.id} alt={Item.name} height="250" width="250"/>
          ))}
        </div>
        <div>
          {Item.description}
        </div>
        <div>
          {Item.location}
        </div>
      </div>
    );
  }
}

const ITEM_QUERY = gql`
  query ItemQuery($id: ID!) {
    Item(id: $id) {
      id
      name
      description
      location
      images {
        id
        url
      }
    }
  }
`;

const ItemDetailsWithQuery = graphql(ITEM_QUERY, {
  name: 'itemQuery',
  options: ({match}) => ({
    variables: {
      id: match.params.itemId,
    }
  }),
})(ItemDetails);

export default ItemDetailsWithQuery;
