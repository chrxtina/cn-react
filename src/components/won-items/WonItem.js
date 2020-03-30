import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import defaultImage from '../../assets/images/img.png';
import ItemContact from '../item-details/ItemContact';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';

class WonItem extends Component {

  render () {
    let imgPreview = this.props.item.images.length > 0 ? this.props.item.images[0].url : defaultImage;
    return (
      <Card fluid style={{maxWidth: 400}}>
        <Card.Content>
          <Image
            floated='left'
            size='tiny'
            src={imgPreview}
          />
          <Card.Header>
            <Link to={`/item/${this.props.item.id}`}>
              {this.props.item.name}
            </Link>
          </Card.Header>
          <Card.Meta>

          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div className='ui three buttons'>
            <ItemContact
              currentUser={this.props.currentUserId}
              owner={this.props.item.owner.id}
              winner={this.props.item.winner.id}
              itemType={this.props.item.itemType}
              isCardBtn={true}
            />
            <Button basic color='red' onClick={this.handleRemoveItem}>
              Remove
            </Button>
          </div>
        </Card.Content>
      </Card>
    )
  }

  handleRemoveItem = async (event) => {
    event.preventDefault();

    let id = this.props.currentUserId;
    let itemsWonIds = this.props.itemsWonIds;
    let wonItemId = this.props.item.id;

    _.remove(itemsWonIds, function(n) {
      return n === wonItemId;
    });

    await this.props.updateWonItemsMutation({
      variables: {id, itemsWonIds}
    });
  }
}

const UPDATE_USER_WON_ITEMS = gql`
  mutation UpdateUser(
    $id: ID!
    $itemsWonIds: [ID!]
  ) {
    updateUser(
      id: $id
      itemsWonIds: $itemsWonIds
    ) {
      id
      itemsWon {
        id
      }
    }
  }
`;

const WonItemWithMutation = graphql(UPDATE_USER_WON_ITEMS, {
  name: 'updateWonItemsMutation'
})(WonItem);

export default withRouter(WonItemWithMutation);
