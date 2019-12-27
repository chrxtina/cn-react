import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql} from 'react-apollo';
import _ from 'lodash';
import gql from 'graphql-tag';
import Dropzone from "react-dropzone";
import { Form, Input, TextArea, Button, Loader } from 'semantic-ui-react';
import ImageThumbnail from './ImageThumbnail';
import ItemMap from './ItemMap';

class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: props.item.id,
        name: props.item.name || "",
        description: props.item.description || "",
        lat: props.item.lat || 0,
        lng: props.item.lng || 0,
        categoryId: props.item.category.id || "",
        itemType: props.item.itemType || "",
        images: props.item.images || [],
        imgIdsToDelete: []
    };
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setCoords = this.setCoords.bind(this);
  }

  handleInputChange(e, result) {
    const value = result.value;
    const name = result.name;

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
    if (this.props.loggedInUserQuery.loading) {
      return (<Loader />)
    }

    let typeOptions = [
      { key: 'Donation', value: 'Donation', text: 'Donation' },
      { key: 'Request', value: 'Request', text: 'Request' }
    ];

    let categoryOptions = [];
    this.props.allCategoriesQuery.allCategories && this.props.allCategoriesQuery.allCategories.map(category => (
      categoryOptions.push({key: category.id, value: category.id, text: category.name.charAt(0).toUpperCase() + category.name.slice(1)})
    ));

    return (
      <div className="item-form">
        <Form onSubmit={this.props.formType === "update" ? this.handleUpdateSubmit : this.handleCreateSubmit}>
          <Form.Group widths='equal'>
            <Form.Select
              placeholder='Select...'
              label="Type"
              name="itemType"
              options={typeOptions}
              onChange={this.handleInputChange}
              value={this.state.itemType}
            />
            <Form.Select
              label="Category"
              placeholder='Select...'
              name="categoryId"
              options={categoryOptions}
              onChange={this.handleInputChange}
              value={this.state.categoryId}
            />
          </Form.Group>

          <Form.Field
            control={Input}
            label='Name'
            placeholder='Name'
            name="name"
            onChange={this.handleInputChange}
            value={this.state.name}
          />

          <Form.Field
            control={TextArea}
            label="Description"
            placeholder='What is your item like?'
            name="description"
            onChange={this.handleInputChange}
            value={this.state.description}
          />

          <Form.Field>
            <label>Location</label>
            <ItemMap
              circleActive={true}
              isEditForm={true}
              setCoords={this.setCoords}
              lat={this.state.lat}
              lng={this.state.lng}
            />
          </Form.Field>

          <Form.Field>
            <label>Images</label>
            <div className="img-preview-uploader">

              { this.state.images.length > 0 && (
                this.state.images.map((image, i) =>
                  <div className="img-preview" key={i}>
                    <ImageThumbnail
                      image={image}
                      onDeleteImage={this.handleDeleteImage}
                      index={i}/>
                  </div>

                )
              )}

              <Dropzone
                onDrop={this.onDrop}
              >
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="dropzone">
                        <div className="upload-text">
                          <span className="icon">+</span>
                          Upload
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </Form.Field>

          <Button
            type='submit'
            floated='right'
          >
            Submit
          </Button>

          {
            this.props.formType === "update" && (
              <Button
                floated='right'
                onClick={this.props.toggleEdit}
                negative
              >
                Cancel
              </Button>
            )
          }
        </Form>
      </div>
    );
  }

  handleCreateSubmit = async (event) => {
    event.preventDefault();

    if (!this.props.loggedInUserQuery.loggedInUser) {
      console.warn('You are logged out. Please log in to complete the action');
      return
    }

    const {
      name,
      description,
      categoryId,
      lat,
      lng,
      images,
      itemType
    } = this.state;

    let imagesIds = images.map(i => i.id);
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

  handleUpdateSubmit = async (event) => {
    event.preventDefault();

    const {
      id,
      name,
      description,
      categoryId,
      lat,
      lng,
      imgIdsToDelete,
      images,
      itemType
    } = this.state;

    let imagesIds = images.map(i => i.id);

    await this.props.updateItemMutation(
      {variables: {
        id,
        name,
        description,
        categoryId,
        lat,
        lng,
        imgIdsToDelete,
        imagesIds,
        itemType
      }});

    this.props.toggleEdit();

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

const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation(
    $id: ID!,
    $name: String!,
    $description: String!,
    $categoryId: ID!,
    $lat: Float,
    $lng: Float,
    $imgIdsToDelete: [String!],
    $imagesIds: [ID!],
    $itemType: ItemType!
  ) {
    updateItem(
      id: $id,
      name: $name,
      description: $description,
      categoryId: $categoryId,
      lat: $lat,
      lng: $lng,
      imgIdsToDelete: $imgIdsToDelete,
      imagesIds: $imagesIds,
      itemType: $itemType
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

const ItemFormWithMutation = _.flowRight(
  graphql(ALL_CATEGORIES_QUERY, {
    name: 'allCategoriesQuery'
  }),
  graphql(CREATE_ITEM_MUTATION, {
    name: 'createItemMutation'
  }),
  graphql(UPDATE_ITEM_MUTATION, {
    name: 'updateItemMutation'
  }),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {
      fetchPolicy: 'network-only'
    }
  })
)(ItemForm);

export default withRouter(ItemFormWithMutation);
