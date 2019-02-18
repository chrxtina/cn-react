import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


class NewMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        text: "",
        conversationId: this.props.conversationId,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const text = event.target.name;

    this.setState({
      [text]: value
    });
  }

  render() {
    if (this.props.loggedInUserQuery.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div className="new-message">
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              name="text"
              type="text"
              value={this.state.text}
              onChange={this.handleInputChange}
              placeholder="Type message here"
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (!this.props.loggedInUserQuery.loggedInUser) {
      console.warn('only logged in users can write new messages');
      return
    }

    const {text, conversationId} = this.state;
    const ownerId = this.props.loggedInUserQuery.loggedInUser.id;
    await this.props.createMessageMutation({
      variables: {text, conversationId, ownerId},
      refetchQueries: [
        {

        }
      ],
    });
  }
}

const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessageMutation($text: String!, $conversationId: ID!, $ownerId: ID!) {
    createMessage(text: $text, conversationId: $conversationId, ownerId: $ownerId) {
      id
      text
      createdAt
    }
  }
`;

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

const NewMessageWithMutation = compose(
  graphql(CREATE_MESSAGE_MUTATION, {
    name: 'createMessageMutation'
  }),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(NewMessage);

export default withRouter(NewMessageWithMutation);
