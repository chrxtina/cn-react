import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import gql from 'graphql-tag';
import ItemForm from '../form/ItemForm';
import { Button, Card, Image, Modal } from 'semantic-ui-react';
import defaultImage from '../../assets/images/img.png';

class MyItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isEditActive: false,
      id: this.props.item.id,
      isExpired: this.props.item.isExpired
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleRenew = this.handleRenew.bind(this);
    this.handleDeactivate = this.handleDeactivate.bind(this);
  }

  toggleEdit() {
    this.setState( state => ({
      isEditActive: !state.isEditActive
    }));
  }

  handleRenew() {
    this.handleToggleStatus(false);
  }

  handleDeactivate() {
    this.handleToggleStatus(true);
  }

  render() {
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
            {this.state.isExpired ? "Expired":"Active"}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div className='ui three buttons'>
            <Modal
              closeOnDimmerClick={false}
              closeIcon
              open={this.state.isEditActive}
              onClose={this.toggleEdit}
              trigger={
                <Button basic color='green' onClick={this.toggleEdit}>
                  Edit
                </Button>
              }
              basic size='small'>
              <Modal.Content>
                <ItemForm item={this.props.item} formType={"update"} toggleEdit={this.toggleEdit}/>
              </Modal.Content>
            </Modal>
            {
              this.props.item.isExpired ?
              <Button basic color='blue' onClick={this.handleRenew}>
                Renew
              </Button> :
              <Button basic color='orange' onClick={this.handleDeactivate}>
                Deactivate
              </Button>
            }
            <Button basic color='red' onClick={this.handleDelete}>
              Delete
            </Button>
          </div>
        </Card.Content>
      </Card>
    )
  }

  handleToggleStatus = async (status) => {
    const {id} = this.state;
    let isExpired = status;
    let renewedAt = isExpired ? null : new Date().toISOString();

    await this.props.toggleStatusItemMutation({
      variables: {id, isExpired, renewedAt},
    });
    this.setState({
      isExpired: status
    });
  }

  handleDelete = () => {
    const {id} = this.state;
    const toDelete = true;

    this.props.deleteItemMutation({
        variables: {id, toDelete},
        refetchQueries: [
          {
            query: gql`
              query UserItemsQuery {
                user {
                  id
                  items {
                    id
                    name
                    description
                    lat
                    lng
                    category {
                      id
                      name
                    }
                    images {
                      id
                      url
                    }
                  }
                }
              }
            `,
          },
          {
            query: gql`
              query MapItemsQuery (
                $minLat: Float!
                $maxLat: Float!
                $minLng: Float!
                $maxLng: Float!
              ) {
                allItems (filter: {
                  lat_gte: $minLat
                  lat_lte: $maxLat
                  lng_gte: $minLng
                  lng_lte: $maxLng
                }){
                  id
                  name
                  category {
                    id
                    name
                  }
                  images {
                    id
                    url
                  }
                  lat
                  lng
                }
              }
            `,
            variables: {
              minLat: parseFloat(localStorage.getItem('minLat')),
              maxLat: parseFloat(localStorage.getItem('maxLat')),
              minLng: parseFloat(localStorage.getItem('minLng')),
              maxLng: parseFloat(localStorage.getItem('maxLng'))
            },
          }
        ],
      })
      .then(this.props.refresh);
  }
}

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: ID!, $toDelete: Boolean) {
    updateItem(id: $id, toDelete: $toDelete) {
      id
    }
  }
`;

const TOGGLE_STATUS_ITEM_MUTATION = gql`
  mutation ToggleStatusItemMutation(
    $id: ID!
    $isExpired: Boolean
    $renewedAt: DateTime
  ) {
    updateItem(
      id: $id
      isExpired: $isExpired
      renewedAt: $renewedAt
    ) {
      id
      isExpired
      renewedAt
    }
  }
`;

const MyItemWithMutation = _.flowRight(
  graphql(DELETE_ITEM_MUTATION, {
    name: 'deleteItemMutation'
  }),
  graphql(TOGGLE_STATUS_ITEM_MUTATION, {
    name: 'toggleStatusItemMutation'
  }),
)(withRouter(MyItem));

export default withRouter(MyItemWithMutation);
