import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class MyItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isEditActive: false,
      id: this.props.item.id,
      name: this.props.item.name,
      description: this.props.item.description,
      location: this.props.item.location,
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
          {this.props.item.name}
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
    const {id, name, description, location, categoryId} = this.state;

    await this.props.updateItemMutation({variables: {id, name, description, location, categoryId}});
  }

  handleDelete = () => {
    const {id} = this.state;

    this.props.deleteItemMutation({variables: {id}})
      .then(this.props.refresh);
  }
}

const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation($id: ID!, $name: String!, $description: String!, $location: String!, $categoryId: ID!) {
    updateItem(id: $id, name: $name, description: $description, location: $location, categoryId: $categoryId) {
      id
      name
      description
      location
    }
  }
`;

const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const MyItemWithMutation = compose(
  graphql(UPDATE_ITEM_MUTATION, {
    name: 'updateItemMutation'
  }),
  graphql(DELETE_ITEM_MUTATION, {
    name: 'deleteItemMutation'
  }),
)(withRouter(MyItem));

export default withRouter(MyItemWithMutation);
