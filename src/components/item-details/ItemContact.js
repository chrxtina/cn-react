import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Message, Button } from 'semantic-ui-react';
import _ from 'lodash';
import gql from 'graphql-tag';

class ItemContact extends Component {

  constructor (props) {
    super(props);
    this.state = {
      convos: props.conversationQuery.allConversations || [],
      convoId: _.get(props.conversationQuery, "allConversations[0].id", "")
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
      usersIds.push(this.props.winner || this.props.currentUser);

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

    const { currentUser, owner, winner, itemType, isCardBtn } = this.props;

    return (
      <>
        {
          itemType === "Donation" &&
          currentUser === owner && (
            <div>
              <Message>
                <Message.Header>A winner has been chosen.</Message.Header>
                <p>
                  Contact the winner below.
                </p>
              </Message>
              <div>A winner has been chosen</div>
              <Button onClick={this.handleSendMessage}> Message Winner </Button>
            </div>
          )
        }

        {
          itemType === "Donation" &&
          currentUser === winner &&
          isCardBtn ? (
            <Button basic color='blue' onClick={this.handleSendMessage}>
              Contact Owner
            </Button>
          ) : (
            <div>
              <Message positive>
                <Message.Header>Congratulations!</Message.Header>
                <p>
                  You are the winner. Contact the owner below.
                </p>
              </Message>
              <Button onClick={this.handleSendMessage}> Message Owner </Button>
            </div>
          )
        }

        {
          itemType === "Request" &&
          currentUser !== winner &&
          currentUser !== owner && (
            <div>
              <Button onClick={this.handleSendMessage}> Message Requester </Button>
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

export default _.flowRight(
  graphql(CONVERSATION_QUERY, {
    name: 'conversationQuery',
    options: (props) => ({
      variables: {
        owner: props.owner,
        winner: props.winner || props.currentUser
      }
    })
  }),
  graphql(CREATE_CONVERSATION_MUTATION, {
    name: 'createConversationMutation'})
)(withRouter(ItemContact));
