import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import gql from 'graphql-tag';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

class MyItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isEditActive: false,
      id: this.props.item.id,
      name: this.props.item.name,
      description: this.props.item.description,
      location: this.props.item.location,
      lat: this.props.item.lat,
      lng: this.props.item.lng,
      categoryId: this.props.item.category.id
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  toggleEdit() {
    this.setState( state => ({
      isEditActive: !state.isEditActive
    }));
    if(!this.state.isEditActive) {
      this.setState( state => ({
        name: this.props.item.name,
        description: this.props.item.description,
        location: this.props.item.location,
        lat: this.props.item.lat,
        lng: this.props.item.lng,
        categoryId: this.props.item.category.id
      }));
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    if (!this.state.isEditActive) {
      return (
        <li>
          <Link to={`category/${this.props.item.category.name}/${this.props.item.category.id}/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
          <div>
            <button onClick={this.toggleEdit}>Edit</button>
            <button onClick={this.handleDelete}>Delete</button>
          </div>
        </li>
      )
    }
    else {
      return (
        <li>
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input
                name="name"
                type="text"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={this.state.description}
                onChange={this.handleInputChange}
              />
            </label>
            <label>
              Location:
              <input
                name="location"
                type="text"
                value={this.state.location}
                onChange={this.handleInputChange}
              />
            </label>
            <div>
              <input type="submit" value="Submit" />
              <button onClick={this.toggleEdit}>Cancel</button>
            </div>
          </form>
        </li>
      )
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const provider = new OpenStreetMapProvider();
    await provider.search({ query: this.state.location })
      .then((result) => this.setState({
        lat: parseFloat(result[0].y),
        lng: parseFloat(result[0].x),
      }));

    const {id, name, description, location, categoryId, lat, lng} = this.state;
    await this.props.updateItemMutation({variables: {id, name, description, location, categoryId, lat, lng}});
    this.setState({
      isEditActive: false,
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
                      url
                    }
                  }
                }
              }
            `,
          },
          {
            query: gql`
              query ItemsQuery($id: ID!) {
                allItems(filter: {
                  category: {
                    id: $id
                  },
                  isExpired: false,
                },
                orderBy: createdAt_ASC
              ) {
                  id
                  name
                  images {
                    url
                  }
                }
              }
            `,
            variables: { id: this.state.categoryId },
          }
        ],
      })
      .then(this.props.refresh);
  }
}

const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation($id: ID!, $name: String!, $description: String!, $location: String!, $categoryId: ID!, $lat: Float, $lng: Float) {
    updateItem(id: $id, name: $name, description: $description, location: $location, categoryId: $categoryId, lat: $lat, lng: $lng) {
      id
      name
      description
      location
      lat
      lng
    }
  }
`;

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: ID!, $toDelete: Boolean) {
    updateItem(id: $id, toDelete: $toDelete) {
      id
    }
  }
`;

const MyItemWithMutation = _.flowRight(
  graphql(UPDATE_ITEM_MUTATION, {
    name: 'updateItemMutation'
  }),
  graphql(DELETE_ITEM_MUTATION, {
    name: 'deleteItemMutation'
  }),
)(withRouter(MyItem));

export default withRouter(MyItemWithMutation);
