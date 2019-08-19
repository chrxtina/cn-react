import React from 'react';
import { Link, Route } from 'react-router-dom';
import ItemListing from './ItemListing';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CategoryListing extends React.Component {
  render () {
    const { match } = this.props;
    return (
      <div>
        <h3>Categories</h3>
        <ul>
          {this.props.allCategoriesQuery.allCategories && this.props.allCategoriesQuery.allCategories.map(category => (
            <li key={category.id}>
              <Link to={`${match.url}/${category.name}/${category.id}`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <Route path={`${match.url}/:category/:categoryId`}
          render={ (props) => <ItemListing {...props} />} />
      </div>
    )
  }
}

const ALL_CATEGORIES_QUERY = gql`
  query AllCategoriesQuery {
    allCategories(orderBy: name_ASC) {
      id
      name
    }
  }
`;

const CategoryListingWithQuery = graphql(ALL_CATEGORIES_QUERY, {
  name: 'allCategoriesQuery',
  options: {
    fetchPolicy: 'network-only',
  },
})(CategoryListing);

export default CategoryListingWithQuery;
