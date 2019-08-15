import React, { Component } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import ItemListingMap from './ItemListingMap';
import MapItemListing from './MapItemListing';
import MapItemListingFilter from './MapItemListingFilter';
import CategorySelect from './CategorySelect';

class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      location: "",
      position: [42.366560, -71.092700],
      coordErrorMsg: "",
      minLat: 0,
      maxLat: 0,
      minLng: 0,
      maxLng: 0,
      mapItems: [],
      markerIdx: -1,
      selectedOption: null,
      filterCategories: [],
      applyFilter: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setMapBounds = this.setMapBounds.bind(this);
    this.setMapItemListing = this.setMapItemListing.bind(this);
    this.openPopUp = this.openPopUp.bind(this);
    this.clearMarkerIdx = this.clearMarkerIdx.bind(this);
    this.setSelectedOption = this.setSelectedOption.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=> {
        this.setState({
          position: [position.coords.latitude, position.coords.longitude]
        });
      });
    }
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
        let coordErrorMsg;
        if (result.length > 0) {
          let coords = [];
          coordErrorMsg = "";
          coords.push(parseFloat(result[0].y))
          coords.push(parseFloat(result[0].x))
          this.setState({
            position: coords,
            coordErrorMsg: coordErrorMsg
          });
        } else {
          coordErrorMsg = "Location not found. Please enter another address";
          this.setState({
            coordErrorMsg: coordErrorMsg
          });
        }
        this.setState({
          location: ""
        });
      });
  }

  setMapBounds(mapBounds) {
    let bounds = {
      minLat: mapBounds._southWest.lat,
      maxLat: mapBounds._northEast.lat,
      minLng: mapBounds._southWest.lng,
      maxLng: mapBounds._northEast.lng
    };

    for (var key in bounds) {
      localStorage.setItem(key, bounds[key]);
    }

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

  setSelectedOption(filters){
    this.setState({
      selectedOption: filters
    });
  }

  applyFilter(){
    let filterCategories = [];
    this.state.selectedOption !== null && this.state.selectedOption.map(category => {
      return filterCategories.push(category.value);
    });
    this.setState({
      applyFilter: true,
      filterCategories: filterCategories
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
         <div>{this.state.coordErrorMsg}</div>

         <CategorySelect setSelectedOption={this.setSelectedOption}/>
         <button onClick={this.applyFilter}>Apply Filter</button>

        <div className="listing-map">
          {
            this.state.filterCategories.length > 0 ? (
              <MapItemListingFilter
                setMapItemListing={this.setMapItemListing}
                openPopUp={this.openPopUp}
                minLat={this.state.minLat}
                maxLat={this.state.maxLat}
                minLng={this.state.minLng}
                maxLng={this.state.maxLng}
                filterCategories={this.state.filterCategories}/>
            ):(
              <MapItemListing
                setMapItemListing={this.setMapItemListing}
                openPopUp={this.openPopUp}
                minLat={this.state.minLat}
                maxLat={this.state.maxLat}
                minLng={this.state.minLng}
                maxLng={this.state.maxLng}/>
            )
          }

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
