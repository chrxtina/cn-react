import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react';

class ItemInterestButton extends Component {

  render () {
    return (
      <Button onClick={this.createInterest} disabled={this.props.disabled}>Interested</Button>
    )
  }

  createInterest = async () => {
    const { currentUserId: owner, itemId } = this.props;

    await this.props.createInterestMutation({variables: {owner, itemId}});
    this.props.disableInterestBtn();
  }
}

const CREATE_INTEREST_MUTATION = gql`
  mutation CreateInterestMutation ($owner: ID!, $itemId: ID!) {
    createInterest(ownerId: $owner, itemId: $itemId) {
      id
    }
  }
`;

export default graphql(CREATE_INTEREST_MUTATION, {name: 'createInterestMutation'})(ItemInterestButton);
