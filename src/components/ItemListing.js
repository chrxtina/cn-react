import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import ItemListingLink from './ItemListingLink';
import ItemDetails from './ItemDetails';

class ItemListing extends Component {
  render() {

    if (this.props.categoryQuery.loading) {
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
          {this.props.categoryQuery.allCategories && this.props.categoryQuery.allCategories.map(category => (
            category.items.map(item =>(
              <ItemListingLink key={item.id} item={item} match={match}/>
            ))
          ))}
        </ul>
        <Route path={`${match.url}/:itemId`}
          render={ (props) => <ItemDetails {...props} />} />
      </div>
    );
  }
}

const CATEGORY_QUERY = gql`
  query CategoryQuery($name: String!) {
    allCategories(filter: {name: $name} orderBy: name_ASC) {
      id
      name
      items {
        id
        name
        images {
          url
        }
      }
    }
  }
`;

const ItemListingWithGraphQL = graphql(CATEGORY_QUERY, {
  name: 'categoryQuery',
  options: ({match}) => ({
    variables: {
      name: match.params.category,
    }
  }),
})(ItemListing);

export default withRouter(ItemListingWithGraphQL);
