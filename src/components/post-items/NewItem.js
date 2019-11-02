import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql} from 'react-apollo';
import _ from 'lodash';
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
        itemType: ""
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
      <div className="new-item content content-med">
        <form onSubmit={this.handleSubmit}>
          <label>
            Type:
            <select
              name="itemType"
              value={this.state.itemType}
              onChange={this.handleInputChange}>
                <option value="" disabled>Select</option>
                <option value="Donation">
                  donation
                </option>
                <option value="Request">
                  request
                </option>
            </select>
          </label>
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

    const {
      name,
      description,
      categoryId,
      imagesIds,
      lat,
      lng,
      itemType
    } = this.state;
    const ownerId = this.props.loggedInUserQuery.loggedInUser.id;
    await this.props.createItemMutation({
      variables: {
        name,
        description,
        categoryId,
        ownerId,
        imagesIds,
        lat,
        lng,
        itemType
      },
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
                  itemType
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
                  url
                }
                lat
                lng
                itemType
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
  mutation CreateItemMutation(
    $name: String!,
    $description: String!,
    $categoryId: ID!,
    $ownerId: ID!,
    $imagesIds: [ID!],
    $lat: Float,
    $lng: Float,
    $itemType: ItemType!
  ) {
    createItem(name: $name,
      description: $description,
      categoryId: $categoryId,
      ownerId: $ownerId,
      imagesIds: $imagesIds,
      lat: $lat,
      lng: $lng,
      itemType: $itemType
    ) {
      id
      name
      description
      category {
        id
      }
      owner {
        id
      }
      images {
        id
      }
      lat
      lng
      itemType
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

const NewItemWithMutation = _.flowRight(
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
