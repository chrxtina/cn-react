import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import gql from 'graphql-tag';
import WonItem from './WonItem';
import { Card } from 'semantic-ui-react';

class WonItemsListing extends Component {

  render() {
    if (this.props.loggedInUserQuery.loading || this.props.userItemsQuery.loading) {
      return (<div>Loading</div>)
    }

    const currentUser = this.props.loggedInUserQuery.loggedInUser;
    const myItems = this.props.userItemsQuery.user.itemsWon;

    let itemsWonIds = [];
    myItems.forEach(item => {
      itemsWonIds.push(item.id);
    });

    if (currentUser === undefined) {
      return (<div>You are not logged in</div>)
    }

    return (
      <div className="content content-med">
        <h3>Won Items</h3>
        <Card.Group>
          {
            myItems.length > 0 ? myItems.map(item =>(
              <WonItem
                key={item.id}
                item={item}
                currentUserId={currentUser.id}
                owner={item.owner.id}
                itemsWonIds={itemsWonIds}
                refresh={() => this.props.userItemsQuery.refetch()} />
            )) : "You haven't won any items"
          }
        </Card.Group>
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
        owner {
          id
        }
        winner {
          id
        }
        itemType
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
