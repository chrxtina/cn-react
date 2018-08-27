import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class ItemDetails extends Component {
  render() {

    const { Item } = this.props.itemQuery;
    console.log(Item);

    return (
      <div>
        <div>
          {/* {Item.name} */}
        </div>
        <div>
          {/* {Item.description} */}
        </div>
        <div>
          {/* {Item.location} */}
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
