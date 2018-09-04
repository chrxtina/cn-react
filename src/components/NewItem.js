import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class NewItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: "",
        description: "",
        location: "",
        categoryId: ""
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
    if (this.props.loggedInUserQuery.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div className="new-item">
        <form onSubmit={this.handleSubmit}>
          <label>
            Category:
            <select
              name="categoryId"
              value={this.state.categoryId}
              onChange={this.handleInputChange}>
                <option value="" disabled>Select</option>
                {this.props.allCategoriesQuery.allCategories && this.props.allCategoriesQuery.allCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
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

    if (!this.props.loggedInUserQuery.loggedInUser) {
      console.warn('only logged in users can create new posts');
      return
    }

    const {name, description, location, categoryId} = this.state;
    const ownerId = this.props.loggedInUserQuery.loggedInUser.id;

    await this.props.createItemMutation({variables: {name, description, location, categoryId, ownerId}});
    this.props.history.replace('/');
  }
}

const ALL_CATEGORIES_QUERY = gql`
  query AllCategoriesQuery {
    allCategories(orderBy: name_ASC) {
      id
      name
    }
  }
`;

const CREATE_ITEM_MUTATION = gql`
  mutation CreateItemMutation($name: String!, $description: String!, $location: String!, $categoryId: ID!, $ownerId: ID!) {
    createItem(name: $name, description: $description, location: $location, categoryId: $categoryId, ownerId: $ownerId) {
      id
      name
      description
      location
    }
  }
`;

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`

const NewItemWithMutation = compose(
  graphql(ALL_CATEGORIES_QUERY, {
    name: 'allCategoriesQuery',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(CREATE_ITEM_MUTATION, {
    name: 'createItemMutation'
  }),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(NewItem)

export default withRouter(NewItemWithMutation);
