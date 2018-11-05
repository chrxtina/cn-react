import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Map, TileLayer, Marker } from 'react-leaflet';
import CountdownTimer from './CountdownTimer';

class ItemDetails extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isExpired: false
    };

    this.handleExpire = this.handleExpire.bind(this);
  }

  handleExpire (){
    this.setState( state => ({
      isExpired: true
    }));
  }

  render() {

    if (this.props.itemQuery.loading) {
      return (
        <div>
          Loading
        </div>
      )
    }

    const { Item } = this.props.itemQuery;
    let position;

    if (Item.lat && Item.lng !== "") {
      position = [Item.lat, Item.lng];
    } else {
      position = [0, 0];
    }

    return (
      <div>
        <div>
          {Item.name}
        </div>
        <div>
          {Item.images.map( image => (
            <img src={image.url} key={image.id} alt={Item.name} className="item-detail-img"/>
          ))}
        </div>
        <div>
          {Item.description}
        </div>
        <div>
          Posted on:
          {Item.createdAt}
        </div>

        {this.state.isExpired ? (
          'Item expired'
        ) : (
          <CountdownTimer createdAt={Item.createdAt} handleExpire={this.handleExpire} />
        )}

        <div>
          {Item.location}
        </div>
        <div id="mapid">
          <Map center={position} zoom="15">
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
            </Marker>
          </Map>
        </div>
      </div>
    );
  }
}

const ITEM_QUERY = gql`
  query ItemQuery($id: ID!) {
    Item(id: $id) {
      id
      createdAt
      name
      description
      location
      lat
      lng
      images {
        id
        url
      }
    }
  }
`;

const ItemDetailsWithQuery = graphql(ITEM_QUERY, {
  name: 'itemQuery',
  options: ({match}) => ({
    variables: {
      id: match.params.itemId,
    }
  }),
})(ItemDetails);

export default ItemDetailsWithQuery;
