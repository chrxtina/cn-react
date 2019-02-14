import React from 'react';
import { Link, Route } from 'react-router-dom';
import Messages from './Messages';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Conversations extends React.Component {
  render () {
    const { match } = this.props;
    return (
      <div>
        <h3>Messages</h3>
        <ul>
          {this.props.allConversationsQuery.allConversations && this.props.allConversationsQuery.allConversations.map(conversation => (
            <li key={conversation.id}>
              <Link to={`${match.url}/${conversation.id}`}>
                {conversation.id}
              </Link>
            </li>
          ))}
        </ul>
        <Route path={`${match.url}/:conversationId`}
          render={ (props) => <Messages {...props} />} />
      </div>
    )
  }
}

const ALL_CONVERSATIONS_QUERY = gql`
  query AllConversationsQuery {
    allConversations {
      id
    }
  }
`;

const ConversationsWithQuery = graphql(ALL_CONVERSATIONS_QUERY, {
  name: 'allConversationsQuery',
  options: {
    fetchPolicy: 'network-only',
  },
})(Conversations);

export default ConversationsWithQuery;
