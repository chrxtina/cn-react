import React, { Component } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import ItemListingMap from './ItemListingMap';
import MapItemListing from './MapItemListing';

class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      location: "",
      position: [42.366560, -71.092700],
      minLat: 0,
      maxLat: 0,
      minLng: 0,
      maxLng: 0,
      mapItems: [],
      markerIdx: -1
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setMapBounds = this.setMapBounds.bind(this);
    this.setMapItemListing = this.setMapItemListing.bind(this);
    this.openPopUp = this.openPopUp.bind(this);
    this.clearMarkerIdx = this.clearMarkerIdx.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const provider = new OpenStreetMapProvider();
    await provider.search({ query: this.state.location })
      .then((result) => {
        let coords = [];
        console.log(result);
        coords.push(parseFloat(result[0].y))
        coords.push(parseFloat(result[0].x))
        this.setState({
          position: coords
        });
      });
  }

  setMapBounds(mapBounds) {
    this.setState({
      minLat: mapBounds._southWest.lat,
      maxLat: mapBounds._northEast.lat,
      minLng: mapBounds._southWest.lng,
      maxLng: mapBounds._northEast.lng,
      mapBounds: mapBounds
    });
  }

  setMapItemListing(mapItemListing){
    this.setState({
      mapItems: mapItemListing
    });
  }

  openPopUp(idx){
    this.setState({
      markerIdx: idx
    });
  }

  clearMarkerIdx(){
    this.setState({
      markerIdx: -1
    });
  }

  render () {
    return (
      <div>
         <form onSubmit={this.handleSubmit}>
           <label>
             Location:
             <input
               name="location"
               type="text"
               value={this.state.location}
               onChange={this.handleInputChange}
             />
           </label>
           <input type="submit" value="Submit" />
         </form>

        <div className="listing-map">
          <MapItemListing
            setMapItemListing={this.setMapItemListing}
            openPopUp={this.openPopUp}
            minLat={this.state.minLat}
            maxLat={this.state.maxLat}
            minLng={this.state.minLng}
            maxLng={this.state.maxLng}/>

          <ItemListingMap
            setMapBounds={this.setMapBounds}
            mapItems={this.state.mapItems}
            position={this.state.position}
            markerIdx={this.state.markerIdx}
            clearMarkerIdx={this.clearMarkerIdx}/>
        </div>
      </div>
    )
  }
}

export default Home;
