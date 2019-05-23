import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class ItemInterestButton extends Component {

  render () {
    return (
      <button onClick={this.createInterest} disabled={this.props.disabled}>Interested</button>
    )
  }

  createInterest = async () => {
    const { currentUser: owner, itemId } = this.props;
    
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
