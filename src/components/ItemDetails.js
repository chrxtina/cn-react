import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Map, TileLayer, Marker } from 'react-leaflet';

class ItemDetails extends Component {

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
            <img src={image.url} key={image.id} alt={Item.name} height="250" width="250"/>
          ))}
        </div>
        <div>
          {Item.description}
        </div>
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
