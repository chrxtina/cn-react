import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ItemListingLink from './ItemListingLink';
import ItemDetails from './ItemDetails';

class ItemListing extends Component {
  render() {

    if (this.props.itemsQuery.loading) {
      return (
        <div>
          Loading
        </div>
      )
    }

    const { match } = this.props;

    return (
      <div >
        <ul>
          {this.props.itemsQuery.allItems && this.props.itemsQuery.allItems.map(item =>(
            <ItemListingLink key={item.id} item={item} match={match}/>
          ))}
        </ul>
        <Route path={`${match.url}/:itemId`}
          render={ (props) => <ItemDetails {...props} />} />
      </div>
    );
  }
}

const ITEMS_QUERY = gql`
  query ItemsQuery($id: ID!) {
    allItems(filter: {
      category: {
        id: $id
      },
      isExpired: false,
    },
    orderBy: createdAt_ASC
  ) {
      id
      name
      images {
        url
      }
    }
  }
`;

const ItemListingWithGraphQL = graphql(ITEMS_QUERY, {
  name: 'itemsQuery',
  options: (props) => ({
    variables: {
      id: props.location.state.categoryId
    }
  }),
})(ItemListing);

export default withRouter(ItemListingWithGraphQL);
