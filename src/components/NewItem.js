import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dropzone from "react-dropzone";
import NewItemMap from './NewItemMap';

class NewItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: "",
        description: "",
        lat: 0,
        lng: 0,
        categoryId: "",
        imagesIds: [],
        imagesUrls: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setCoords = this.setCoords.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  setCoords(lat, lng) {
    this.setState({
      lat: lat,
      lng: lng
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
        imagesIds: [...this.state.imagesIds, image.id],
        imagesUrls: [...this.state.imagesUrls, image.url]
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
          <div>
            <div>
              Location
              <NewItemMap setCoords={this.setCoords}/>
            </div>
          </div>
          <label>Upload image</label>
          <Dropzone
            onDrop={this.onDrop}
          >
              <div>Drop an image or click to select</div>
          </Dropzone>

          {this.state.imagesUrls.length > 0 ?
            <div>
              {this.state.imagesUrls.map((image) =>
                <img src={image} key={image} alt="Preview" className="item-preview"/>
              )}
            </div>
            : null}

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

    const {name, description, location, categoryId, imagesIds, lat, lng} = this.state;
    const ownerId = this.props.loggedInUserQuery.loggedInUser.id;
    await this.props.createItemMutation({
      variables: {name, description, location, categoryId, ownerId, imagesIds, lat, lng},
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
  mutation CreateItemMutation($name: String!, $description: String!, $location: String!, $categoryId: ID!, $ownerId: ID!, $imagesIds: [ID!], $lat: Float, $lng: Float) {
    createItem(name: $name, description: $description, location: $location, categoryId: $categoryId, ownerId: $ownerId, imagesIds: $imagesIds, lat: $lat, lng: $lng) {
      id
      name
      description
      location
      lat
      lng
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
    name: 'allCategoriesQuery'
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
