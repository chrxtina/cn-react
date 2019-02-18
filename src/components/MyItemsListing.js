import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import MyItem from './MyItem';

class MyItemsListing extends Component {

  render() {
    if (this.props.loggedInUserQuery.loading || this.props.userItemsQuery.loading) {
      return (<div>Loading</div>)
    }

    const currentUser = this.props.loggedInUserQuery.loggedInUser;
    const myItems = this.props.userItemsQuery.user.items;

    if (currentUser === undefined) {
      return (<div>You are not logged in</div>)
    }

    return (
      <div>
        <ul>
          {
            myItems.map(item =>(
              <MyItem key={item.id} item={item} refresh={() => this.props.userItemsQuery.refetch()} />
            ))
          }
        </ul>
      </div>
    );
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

const USER_ITEMS_QUERY = gql`
  query UserItemsQuery {
    user {
      id
      items {
        id
        name
        description
        location
        category {
          id
          name
        }
      }
    }
  }
`;

const MyItemsListingWithQuery = compose(
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: { fetchPolicy: 'network-only' }
  }),
  graphql(USER_ITEMS_QUERY, {name: 'userItemsQuery'})
)(withRouter(MyItemsListing));

export default withRouter(MyItemsListingWithQuery);
