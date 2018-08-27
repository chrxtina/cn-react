import React, { Component } from 'react';
import ItemDetails from './ItemDetails';
import { Link, Route, withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class ItemListing extends Component {
  render() {
    const { match } = this.props;

    return (
      <div >
        <ul>
          {this.props.categoryQuery.allCategories && this.props.categoryQuery.allCategories.map(category => (
            category.items.map(item =>(
              <li key={item.id}>
                <Link to={`${match.url}/${item.id}`}>
                  {item.name}
                </Link>
              </li>
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
