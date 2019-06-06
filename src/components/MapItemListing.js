import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class MapItemListing extends Component {

  componentDidUpdate(prevProps){
    if (this.props.mapItemQuery.loading !== prevProps.mapItemQuery.loading) {
      this.props.setMapItemListing(this.props.mapItemQuery.allItems)
    }
  }

  handleClick(idx){
    this.props.openPopUp(idx);
  }

  render () {
    if (this.props.mapItemQuery.loading) {
      return (
        <div>
          Loading
        </div>
      )
    }

    const Items = this.props.mapItemQuery.allItems;

    return (
      <div className="map-item-listing">
        <div>Item Listing:</div>
        {
          Items && Items.length > 0 ? (
            <ul>
              {
                Items.map((item, idx) =>
                  <li key={`item-${idx}`}>
                    <div
                      onClick={() => this.handleClick(idx)}
                      >
                      {item.name}
                    </div>
                    <i> ({item.category.name}) </i>
                    <Link
                      to={`category/${item.category.name}/${item.category.id}/${item.id}` }
                      target="_blank">
                      View
                    </Link>
                  </li>
                )
              }
            </ul>
          ) : "No items found in this area"
        }
      </div>
    )
  }
}

const MAP_ITEMS_QUERY = gql`
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
        name
      }
      images {
        url
      }
      lat
      lng
    }
  }
`;

const MapItemListingWithGraphQL = graphql(MAP_ITEMS_QUERY, {
  name: 'mapItemQuery',
  options: (props) => ({
    variables: {
      minLat: props.minLat,
      maxLat: props.maxLat,
      minLng: props.minLng,
      maxLng: props.maxLng
    }
  })
})(MapItemListing);

export default withRouter(MapItemListingWithGraphQL);
