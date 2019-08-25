import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import gql from 'graphql-tag';
import EditItemMap from './EditItemMap';
import ImageThumbnail from './ImageThumbnail';
import Dropzone from "react-dropzone";

class MyItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isEditActive: false,
      id: this.props.item.id,
      name: this.props.item.name,
      description: this.props.item.description,
      lat: this.props.item.lat,
      lng: this.props.item.lng,
      categoryId: this.props.item.category.id,
      isExpired: this.props.item.isExpired,
      images: this.props.item.images,
      imgIdsToDelete: []
    };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setCoords = this.setCoords.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
  }

  toggleEdit() {
    this.setState( state => ({
      isEditActive: !state.isEditActive
    }));
    if(!this.state.isEditActive) {
      this.setState( state => ({
        name: this.props.item.name,
        description: this.props.item.description,
        lat: this.props.item.lat,
        lng: this.props.item.lng,
        categoryId: this.props.item.category.id,
        images: this.props.item.images,
        imgIdsToDelete: []
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
        images: [...this.state.images, image]
      });
    });
  }

  handleDeleteImage(id, i) {
    let images = [...this.state.images];
    let imgIdsToDelete = [...this.state.imgIdsToDelete];

    imgIdsToDelete.push(id);
    images.splice(i, 1);

    this.setState({
      images: images,
      imgIdsToDelete: imgIdsToDelete
    });
  }

  render() {
    if (!this.state.isEditActive) {
      return (
        <li>
          <Link to={`/item/${this.props.item.id}`}>
            {this.props.item.name}
          </Link>
          <span>{this.state.isExpired ? "Expired":"Active"}</span>
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
            <EditItemMap lat={this.props.item.lat} lng={this.props.item.lng} setCoords={this.setCoords}/>

            {
              this.state.images.length > 0 && (
                <div>
                  {this.state.images.map((image, i) =>
                    <ImageThumbnail image={image} key={i} onDeleteImage={this.handleDeleteImage} index={i}/>
                  )}
                </div>
              )
            }

            <label>Add image</label>
            <Dropzone
              onDrop={this.onDrop}
            >
                <div>Drop an image or click to select</div>
            </Dropzone>

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

    const {
      id,
      name,
      description,
      categoryId,
      lat,
      lng,
      imgIdsToDelete,
      images
    } = this.state;

    let imagesIds = [];
    images.map(image => {
      imagesIds.push(image.id);
    })

    await this.props.updateItemMutation(
      {variables: {
        id,
        name,
        description,
        categoryId,
        lat,
        lng,
        imgIdsToDelete,
        imagesIds
      }});
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

const ALL_CATEGORIES_QUERY = gql`
  query AllCategoriesQuery {
    allCategories(orderBy: name_ASC) {
      id
      name
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation(
    $id: ID!,
    $name: String!,
    $description: String!,
    $categoryId: ID!,
    $lat: Float,
    $lng: Float,
    $imgIdsToDelete: [String!],
    $imagesIds: [ID!]
  ) {
    updateItem(
      id: $id,
      name: $name,
      description: $description,
      categoryId: $categoryId,
      lat: $lat,
      lng: $lng,
      imgIdsToDelete: $imgIdsToDelete,
      imagesIds: $imagesIds
    ) {
      id
      name
      category {
        id
      }
      description
      lat
      lng
      images {
        id
        url
      }
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
  graphql(ALL_CATEGORIES_QUERY, {
    name: 'allCategoriesQuery'
  }),
  graphql(UPDATE_ITEM_MUTATION, {
    name: 'updateItemMutation'
  }),
  graphql(DELETE_ITEM_MUTATION, {
    name: 'deleteItemMutation'
  }),
)(withRouter(MyItem));

export default withRouter(MyItemWithMutation);
