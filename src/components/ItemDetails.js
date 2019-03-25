import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Map, TileLayer, Marker } from 'react-leaflet';
import CountdownTimer from './CountdownTimer';
import ItemContact from './ItemContact';

class ItemDetails extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isExpired: false,
      currentUser: "",
      owner: "",
      winner: ""
    };

    this.handleExpire = this.handleExpire.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.loggedInUserQuery !== prevProps.loggedInUserQuery &&
      this.props.loggedInUserQuery.loading === false) {
      this.setState({
        currentUser: this.props.loggedInUserQuery.loggedInUser.id
      });
    }

    if (this.props.itemQuery !== prevProps.itemQuery &&
      this.props.itemQuery.loading === false) {
      this.setState({
        owner: this.props.itemQuery.Item.owner.id,
      });

      if (this.props.itemQuery.Item.winner !== null ) {
        this.setState({
          winner: this.props.itemQuery.Item.winner.id
        });
      }
    }
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
        {
           Item.isExpired && (this.state.currentUser === this.state.owner || this.state.currentUser === this.state.winner) ? (
             <ItemContact currentUser={this.state.currentUser} owner={this.state.owner} winner={this.state.winner} />
           ) : null
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
      location
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

export default compose(
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
