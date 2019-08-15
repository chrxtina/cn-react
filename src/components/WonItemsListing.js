import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import gql from 'graphql-tag';
import WonItemListingLink from './WonItemListingLink';

class WonItemsListing extends Component {

  render() {
    if (this.props.loggedInUserQuery.loading || this.props.userItemsQuery.loading) {
      return (<div>Loading</div>)
    }

    const currentUser = this.props.loggedInUserQuery.loggedInUser;
    const myItems = this.props.userItemsQuery.user.itemsWon;

    if (currentUser === undefined) {
      return (<div>You are not logged in</div>)
    }

    return (
      <div>
        <ul>
          {
            myItems.map(item =>(
              <WonItemListingLink key={item.id} item={item} refresh={() => this.props.userItemsQuery.refetch()} />
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
      itemsWon {
        id
        name
        images {
          url
        }
        category {
          name
          id
        }
      }
    }
  }
`;

const WonItemsListingWithQuery = _.flowRight(
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: { fetchPolicy: 'network-only' }
  }),
  graphql(USER_ITEMS_QUERY, {name: 'userItemsQuery'})
)(withRouter(WonItemsListing));

export default withRouter(WonItemsListingWithQuery);
