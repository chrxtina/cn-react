import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Message from './Message';
import NewMessage from './NewMessage';


class Messages extends Component {

  componentDidMount() {
    this.createMessageSubscription = this.props.messagesQuery.subscribeToMore({
      document: gql`
        subscription {
          Message(filter: {
              mutation_in: [CREATED]
          }) {
            node {
              id
              text
              createdAt
              owner {
                id
                name
              }
            }
          }
        }
      `,
      updateQuery: (previousState, {subscriptionData}) => {
        const newMessage = subscriptionData.data.Message.node;
        const messages = previousState.allMessages.concat([newMessage]);
        return {
          allMessages: messages
        }
      },
      onError: (err) => console.error(err),
    })
  }

  render() {

    if (this.props.messagesQuery.loading) {
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
          {this.props.messagesQuery.allMessages && this.props.messagesQuery.allMessages.map(message =>(
            <Message key={message.id} message={message}  ownerId={message.owner.id} currentUserId={this.props.currentUserId} />
          ))}
        </ul>
        <NewMessage conversationId={match.params.conversationId}/>
      </div>
    );
  }
}

const MESSAGES_QUERY = gql`
  query MessagesQuery($id: ID!) {
    allMessages(filter: {
      conversation: {
        id: $id
      },
    },
    orderBy: createdAt_ASC
  ) {
      id
      text
      createdAt
      owner {
        id
      }
    }
  }
`;

const MessagesWithGraphQL = graphql(MESSAGES_QUERY, {
  name: 'messagesQuery',
  options: (props) => ({
    variables: {
       id: props.match.params.conversationId
    }
  }),
})(Messages);

export default withRouter(MessagesWithGraphQL);
