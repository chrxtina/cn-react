import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dropzone from "react-dropzone";

class NewItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: "",
        description: "",
        location: "",
        categoryId: "",
        imagesIds: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  onDrop = (files) => {
    let data = new FormData();
    data.append('data', files[0]);

    fetch('https://api.graph.cool/file/v1/cjl5h50yv4ufs0116k644tfp4', {
      method: 'POST',
      body: data
    }).then(response => {
      return response.json()
    }).then(image => {

      this.setState({
        imagesIds: [...this.state.imagesIds, image.id]
      });
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
          <label>Upload image</label>
          <Dropzone
            onDrop={this.onDrop}
          >
              <div>Drop an image or click to select</div>
          </Dropzone>
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

    const {name, description, location, categoryId, imagesIds} = this.state;
    const ownerId = this.props.loggedInUserQuery.loggedInUser.id;

    await this.props.createItemMutation({
      variables: {name, description, location, categoryId, ownerId, imagesIds},
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
                  location
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
          query CategoryQuery($id: ID!) {
            allCategories(filter: {id: $id} orderBy: name_ASC) {
              id
              name
              items {
                id
                name
              }
            }
          }
        `,
        variables: { id: this.state.categoryId },
      }
    ],
    });
    this.props.history.replace('/my-items');
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
  mutation CreateItemMutation($name: String!, $description: String!, $location: String!, $categoryId: ID!, $ownerId: ID!, $imagesIds: [ID!]) {
    createItem(name: $name, description: $description, location: $location, categoryId: $categoryId, ownerId: $ownerId, imagesIds: $imagesIds) {
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
)(NewItem);

export default withRouter(NewItemWithMutation);
