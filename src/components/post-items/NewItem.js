import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql} from 'react-apollo';
import _ from 'lodash';
import gql from 'graphql-tag';
import Dropzone from "react-dropzone";
import { Form, Dropdown, Input, TextArea, Button } from 'semantic-ui-react';
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
        imagesIds: [...this.state.imagesIds, image.id],
        imagesUrls: [...this.state.imagesUrls, image.url]
      });
    });
  }

  render() {
    if (this.props.loggedInUserQuery.loading) {
      return (<div>Loading</div>)
    }

    let typeOptions = [
      { key: 'Donation', value: 'Donation', text: 'Donation' },
      { key: 'Request', value: 'Request', text: 'Request' }
    ];

    let categoryOptions = [];
    this.props.allCategoriesQuery.allCategories && this.props.allCategoriesQuery.allCategories.map(category => (
      categoryOptions.push({key: category.id, value: category.id, text: category.name})
    ));

    return (
      <div className="new-item content content-med">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Select
              placeholder='Select...'
              label="Type"
              name="itemType"
              options={typeOptions}
              onChange={this.handleInputChange}
            />
            <Form.Select
              label="Category"
              placeholder='Select...'
              name="categoryId"
              options={categoryOptions}
              onChange={this.handleInputChange}
            />
          </Form.Group>

          <Form.Field
            control={Input}
            label='Name'
            placeholder='Name'
            name="name"
            onChange={this.handleInputChange}
          />

          <Form.Field
            control={TextArea}
            label="Description"
            placeholder='What is your item like?'
            name="description"
            onChange={this.handleInputChange}
          />

          <Form.Field>
            <label>Location</label>
            <NewItemMap setCoords={this.setCoords}/>
          </Form.Field>

          <Form.Field>
            <label>Images</label>
            <div className="img-preview-uploader">

              { this.state.imagesUrls.length > 0 && (
                <div className="img-preview">
                  {this.state.imagesUrls.map((image) =>
                    <img src={image} key={image} alt="Preview"/>
                  )}
                </div>
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
          <Button type='submit'>Submit</Button>
        </Form>
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
