import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Placeholder from '../placeholders/ItemListing';

class MapItemListingFilter extends Component {

  componentDidUpdate(prevProps){
    if (this.props.mapItemCategoryQuery.loading !== prevProps.mapItemCategoryQuery.loading) {
      this.props.setMapItemListing(this.props.mapItemCategoryQuery.allItems)
    }
  }

  handleClick(idx){
    this.props.openPopUp(idx);
  }

  render () {
    if (this.props.mapItemCategoryQuery.loading) {
      return (
        <div className="map-item-listing loading">
          <Placeholder />
        </div>
      )
    }

    const Items = this.props.mapItemCategoryQuery.allItems;

    return (
      <div className="map-item-listing">
        <div className="results-number">{Items.length} {this.props.isDonation ? "Donation" : "Request"}{Items.length !== 1 && ("s")}</div>
        {
          Items && Items.length > 0 ? (
            Items.map((item, idx) =>
              <div key={`item-${idx}`} className="listing-item">
                <div
                  className="item-title"
                  onClick={() => this.handleClick(idx)}
                  >
                  {item.name}
                </div>
                <i> ({item.category.name}) </i>
                <Link
                  to={`/item/${item.id}` }
                  target="_blank">
                  View
                </Link>
              </div>
            )
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
    $filterCategories: [String!]
    $itemType: ItemType!
  ) {
    allItems (filter: {
      lat_gte: $minLat
      lat_lte: $maxLat
      lng_gte: $minLng
      lng_lte: $maxLng
      itemType: $itemType
      category: {
        name_in: $filterCategories
      }
    }){
      id
      name
      category {
        id
        name
      }
      itemType
      images {
        url
      }
      lat
      lng
    }
  }
`;

const MapItemListingWithGraphQL = graphql(MAP_ITEMS_QUERY, {
  name: 'mapItemCategoryQuery',
  options: (props) => ({
    variables: {
      minLat: props.minLat,
      maxLat: props.maxLat,
      minLng: props.minLng,
      maxLng: props.maxLng,
      filterCategories: props.filterCategories,
      itemType: props.isDonation ? "Donation" : "Request"
    }
  })
})(MapItemListingFilter);

export default withRouter(MapItemListingWithGraphQL);
