import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import { Map, TileLayer, Circle } from 'react-leaflet';
import CountdownTimer from './CountdownTimer';
import ItemContact from './ItemContact';
import ItemInterestButton from './ItemInterestButton';

class ItemDetails extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isExpired: false,
      currentUserId: "",
      interestBtnOff: false
    };

    this.handleExpire = this.handleExpire.bind(this);
    this.disableInterestBtn = this.disableInterestBtn.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.loggedInUserQuery !== prevProps.loggedInUserQuery &&
      this.props.loggedInUserQuery.loading === false) {
      this.setState({
        currentUserId: this.props.loggedInUserQuery.loggedInUser.id
      });
    }
  }

  disableInterestBtn() {
    this.setState({
      interestBtnOff: true
    });
  }

  handleExpire() {
    this.setState({
      isExpired: true
    });
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

    let position= [Item.lat, Item.lng];

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

        {
          this.state.currentUserId !== null && ((
            Item.owner.id === this.state.currentUserId ||
            Item.isExpired === true ||
            Item.interests.find(interest => {return interest.owner.id === this.state.currentUserId}) ||
            this.state.interestBtnOff === true
          ) ? (
              <ItemInterestButton
                disabled={true}
                currentUserId={this.state.currentUserId}
                itemId={Item.id}
              >
                Interested!
              </ItemInterestButton>
            ) : (
              <ItemInterestButton
                disabled={false}
                currentUserId={this.state.currentUserId}
                itemId={Item.id}
                disableInterestBtn={this.disableInterestBtn}
              >
                Interested!
              </ItemInterestButton>
            )
          )
        }
        {
          this.state.currentUserId === null &&
          this.state.isExpire !== false && (
            <div>You're logged out. Log in for a chance to win this item!</div>
          )
        }
        <div id="mapid">
          <Map
            style={{
              height: "400px",
              width: "400px"
             }}
            center={position}
            zoom="15"
            maxZoom="16">
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={position} radius={300}>
            </Circle>
          </Map>
        </div>

        {
          Item.isExpired && (
            Item.winner !== null ? (
              ((this.state.currentUserId === Item.owner.id) || (this.state.currentUserId === Item.winner.id)) && (
                <ItemContact
                 currentUser={this.state.currentUserId}
                 owner={Item.owner.id}
                 winner={Item.winner.id}
               />
              )
            ) : (
              (this.state.currentUserId === Item.owner.id) && (
                <div>Item expired with no winner, repost your item</div>
              )
            )
          )
        }
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
      lat
      lng
      images {
        id
        url
      }
      isExpired
      owner {
        id
      }
      winner {
        id
      }
      interests {
        owner {
          id
        }
      }
    }
  }
`;

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

export default _.flowRight(
  graphql(ITEM_QUERY, {
    name: 'itemQuery',
    options: ({match}) => ({
      variables: {
        id: match.params.itemId,
      }
    }),
  }),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: { fetchPolicy: 'network-only' }
  })
)(ItemDetails);
