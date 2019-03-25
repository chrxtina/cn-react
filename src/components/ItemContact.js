import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class ItemContact extends Component {

  constructor (props) {
    super(props);
    this.state = {
      convos: [],
      convoId: ""
    };
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentDidUpdate(prevProps) {
    const query = this.props.conversationQuery;

    if (query !== prevProps.conversationQuery &&
      query.loading === false &&
      query.allConversations.length > 0
    ) {
      this.setState({
        convos: query.allConversations,
        convoId: query.allConversations[0].id
      });
    }
  }

  handleSendMessage = async () => {
    if ( this.state.convos.length < 1) {
      let usersIds = [];
      usersIds.push(this.props.owner);
      usersIds.push(this.props.winner);

      await this.props.createConversationMutation({
        variables: {usersIds},
        awaitRefetchQueries: true,
        refetchQueries: [`ConversationQuery`]
      });
      this.props.history.replace(`/messages/${this.props.conversationQuery.allConversations[0].id}`);
    } else {
      this.props.history.replace(`/messages/${this.state.convoId}`);
    }
  }

  render() {

    const { currentUser, owner, winner } = this.props;

    return (
      <>
        {
          currentUser === owner  &&  (
            winner !== "" ? (
              <div>
                <div>A winner has been chosen</div>
                <button onClick={this.handleSendMessage}> Message Winner </button>
              </div>
            ) : (
              <div>
                <div>Item expired with no winner, repost your item</div>
              </div>
            )
          )
        }

        {
          currentUser === winner  && (
            <div>
              <div>You are the winner!</div>
              <button onClick={this.handleSendMessage}> Message Owner </button>
            </div>
          )
        }
      </>
    );
  }
}

const CONVERSATION_QUERY = gql`
  query ConversationQuery($owner:ID!, $winner:ID!) {
    allConversations(filter: {
      AND: [{
        users_some:{
          id: $owner
        }
      },{
        users_some:{
          id: $winner
        }
      }]
    }) {
      id
      users {
        id
        name
      }
    }
  }
`;

const CREATE_CONVERSATION_MUTATION = gql`
  mutation CreateConversationMutation($usersIds: [ID!]) {
    createConversation(usersIds: $usersIds) {
      id
    }
  }
`;

export default compose(
  graphql(CONVERSATION_QUERY, {
    name: 'conversationQuery',
    options: (props) => ({
      variables: {
        owner: props.owner,
        winner: props.winner
      }
    })
  }),
  graphql(CREATE_CONVERSATION_MUTATION, {
    name: 'createConversationMutation'})
)(withRouter(ItemContact));
