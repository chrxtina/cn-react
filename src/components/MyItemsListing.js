import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import _ from 'lodash';
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
      <div className="content content-med">
        <h3>My Items</h3>
        <ul>
          {
            myItems.length > 0 ? myItems.map(item =>(
              <MyItem key={item.id} item={item} refresh={() => this.props.userItemsQuery.refetch()} />
            )) : "You don't have any items posted"
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
        lat
        lng
        isExpired
        category {
          id
          name
        }
        images {
          id
          url
        }
      }
    }
  }
`;

const MyItemsListingWithQuery = _.flowRight(
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: { fetchPolicy: 'network-only' }
  }),
  graphql(USER_ITEMS_QUERY, {name: 'userItemsQuery'})
)(withRouter(MyItemsListing));

export default withRouter(MyItemsListingWithQuery);
