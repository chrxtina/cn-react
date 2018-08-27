import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class NewItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
        category: "",
        name: "",
        description: "",
        location: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="new-item">
        <form onSubmit={this.handleSubmit}>
          <label>
            Category:
            <select
              name="category"
              value={this.state.category}
              onChange={this.handleInputChange}>
                <option value="books">Books</option>
                <option value="games">Games</option>
            </select>
          </label>
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
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {name, description, location} = this.state;
    await this.props.createItemMutation({variables: {name, description, location}});
    this.props.history.replace('/');
  }
}

const CREATE_ITEM_MUTATION = gql`
  mutation CreateItemMutation($name: String!, $description: String!, $location: String!) {
    createItem(name: $name, description: $description, location: $location) {
      id
      name
      description
      location
    }
  }
`;

const NewItemWithMutation = graphql(CREATE_ITEM_MUTATION, {name: 'createItemMutation'})(NewItem);

export default withRouter(NewItemWithMutation);
