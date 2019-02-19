import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Messages from './Messages';

class Conversations extends React.Component {

  render () {
    if (this.props.loggedInUserQuery.loading || this.props.userConversationsQuery.loading) {
      return (<div>Loading</div>)
    }

    const { match } = this.props;
    const currentUserId = this.props.loggedInUserQuery.loggedInUser.id;

    return (
      <div>
        <h3>Messages</h3>
        <ul>
          {this.props.userConversationsQuery.user.conversations && this.props.userConversationsQuery.user.conversations.map(conversation => (
            <li key={conversation.id}>
              <Link to={`${match.url}/${conversation.id}`}>
                {conversation.users.map( user => {
                  return currentUserId !== user.id ? <span key={user.id}>{user.name}</span> : null
                })}
              </Link>
            </li>
          ))}
        </ul>
        <Route path={`${match.url}/:conversationId`}
          render={ (props) => <Messages {...props} currentUserId={currentUserId} />} />
      </div>
    )
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

const USER_CONVERSATIONS_QUERY = gql`
  query UserConversationsQuery {
    user {
      id
      conversations {
        id
        users {
          id
          name
        }
      }
    }
  }
`;

export default compose(
  graphql(USER_CONVERSATIONS_QUERY, {
    name: 'userConversationsQuery'}),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(withRouter(Conversations));
