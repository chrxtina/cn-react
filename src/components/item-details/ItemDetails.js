import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import { Map, TileLayer, Circle } from 'react-leaflet';
import { Message, Header, Label } from 'semantic-ui-react';
import CountdownTimer from './CountdownTimer';
import ItemContact from './ItemContact';
import ItemInterestButton from './ItemInterestButton';
import Carousel from '../image-carousel/Carousel';

class ItemDetails extends Component {

  constructor (props) {
    super(props);
    this.state = {
      hasExpired: false,
      currentUserId: "",
      interestBtnOff: false
    };

    this.disableInterestBtn = this.disableInterestBtn.bind(this);
    this.handleHasExpired = this.handleHasExpired.bind(this);
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

  handleHasExpired() {
    this.setState({
      hasExpired: true
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

    let interestBtn = false;
    if (this.state.currentUserId === null ||
    Item.interests.find(interest => {return interest.owner.id === this.state.currentUserId}) ||
    this.state.interestBtnOff === true) {
      interestBtn = true;
    }

    return (
      <div className="item-details content content-med">

        {
          Item.images.length > 0 && (
            <div className="section one">
              <div className="item-images item-section">
                <Carousel images={Item.images}/>
              </div>
            </div>
          )
        }

        <div className="section two">
          <div className="item-info item-section">
            <Header as='h1'>{Item.name}</Header>
            <Label color={ Item.itemType === "Donation" ? "blue" : "green"} horizontal>
              {Item.itemType}
            </Label>
            <div>
              Posted on:
              {Item.createdAt}
            </div>
            <div>
              {Item.description}
            </div>
          </div>

          <div id="mapid" className="item-map item-section">
            <Map
              style={{
                height: "100%",
                width: "100%"
               }}
              center={position}
              zoom="15"
              maxZoom="16"
              doubleClickZoom={false}
              scrollWheelZoom={false}>
              <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle center={position} radius={300}>
              </Circle>
            </Map>
          </div>
        </div>

        <div className="section three item-section timer-btns">
          <div className="column one">
            {
              Item.renewedAt ? (
                <CountdownTimer
                  startTime={Item.renewedAt}
                  isExpired={Item.isExpired}
                  handleHasExpired={this.handleHasExpired}
                />
              ) : (
                <CountdownTimer
                  startTime={Item.createdAt}
                  isExpired={Item.isExpired}
                  handleHasExpired={this.handleHasExpired}
                />
              )
            }
          </div>
          <div className="column two">
            {
              Item.itemType === "Donation" &&
              !Item.isExpired &&
              !this.state.hasExpired &&
              this.state.currentUserId === null && (
                <Message warning>
                  <Message.Header>You are logged out.</Message.Header>
                  <p>Log in for a chance to win this item.</p>
                </Message>
              )
            }
            {
              Item.itemType === "Donation" &&
              !Item.isExpired &&
              !this.state.hasExpired &&
              Item.owner.id !== this.state.currentUserId && (
                (
                  <ItemInterestButton
                    disabled={interestBtn}
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
              Item.itemType === "Donation" &&
              (
                Item.isExpired ? (
                  Item.winner !== null ? (
                    ((this.state.currentUserId === Item.owner.id) ||
                    (this.state.currentUserId === Item.winner.id)) &&
                    (
                      <ItemContact
                       currentUser={this.state.currentUserId}
                       owner={Item.owner.id}
                       winner={Item.winner.id}
                       itemType={Item.itemType}
                     />
                    )
                  ) : (
                    (this.state.currentUserId === Item.owner.id) && (
                      <>
                        <Message warning>
                          <p>Item expired with no winner, repost your item.</p>
                        </Message>
                      </>
                    )
                  )
                ) : (
                  (this.state.currentUserId === Item.owner.id) && (
                    <>
                      <Message>
                        <Message.Header>Your item is still active.</Message.Header>
                        <p>You may contact the winner once one is chosen.</p>
                      </Message>
                    </>
                  )
                )
              )
            }
            {
              Item.itemType === "Request" && (
                Item.isExpired ? (
                  this.state.currentUserId && (
                    this.state.currentUserId === Item.owner.id && (
                      <Message warning>
                        <Message.Header>This is your item.</Message.Header>
                        <p>Repost it again.</p>
                      </Message>
                    )
                  )
                ) : (
                  this.state.currentUserId ? (
                    this.state.currentUserId === Item.owner.id ? (
                      <Message>
                        <Message.Header>This is your item.</Message.Header>
                        <p>Good luck!</p>
                      </Message>
                    ) : (
                      <ItemContact
                       currentUser={this.state.currentUserId}
                       owner={Item.owner.id}
                       itemType={Item.itemType}
                     />
                    )
                  ) : (
                    <Message warning>
                      <Message.Header>You are logged out.</Message.Header>
                      <p>Log in to contact the requester</p>
                    </Message>
                  )
                )
              )
            }
          </div>
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
      renewedAt
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
