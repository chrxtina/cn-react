import React, { Component } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Form } from 'semantic-ui-react';
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
      applyFilter: false,
      isRequest: JSON.parse(localStorage.getItem('isRequest')) || false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setMapBounds = this.setMapBounds.bind(this);
    this.setMapItemListing = this.setMapItemListing.bind(this);
    this.openPopUp = this.openPopUp.bind(this);
    this.clearMarkerIdx = this.clearMarkerIdx.bind(this);
    this.setSelectedOption = this.setSelectedOption.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.handleToggleRequest = this.handleToggleRequest.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isRequest !== prevState.isRequest) {
      localStorage.setItem('isRequest', this.state.isRequest);
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
      return filterCategories.push(category);
    });
    this.setState({
      applyFilter: true,
      filterCategories: filterCategories
    });
  }

  handleToggleRequest(){
    this.setState({
      isRequest: !this.state.isRequest
    });
  }

  render () {
    return (
      <div className="main-search-map">
        <div className="search-criteria">
          <div className="location-search inline">
             <Form onSubmit={this.handleSubmit}>
               <Form.Input
                action={{ icon: 'search' }}
                label='Location'
                placeholder='Boston, MA'
                name="location"
                onChange={this.handleInputChange}
              />
             </Form>

            {
              this.state.coordErrorMsg && (<div>{this.state.coordErrorMsg}</div>)
            }
          </div>

          <div className="switcher switcher-1">
             <input
               type="checkbox"
               id="switcher-1"
               checked={this.state.isRequest}
               onChange={this.handleToggleRequest}
             />
             <label htmlFor="switcher-1"></label>
          </div>

          <div className="category-filter">
            <div className="category-select">
              <CategorySelect setSelectedOption={this.setSelectedOption}/>
            </div>
            <div className="filter-button"><button onClick={this.applyFilter} className="ui button">Apply</button></div>
          </div>
        </div>

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
                filterCategories={this.state.filterCategories}
                isDonation={!this.state.isRequest}/>
            ):(
              <MapItemListing
                setMapItemListing={this.setMapItemListing}
                openPopUp={this.openPopUp}
                minLat={this.state.minLat}
                maxLat={this.state.maxLat}
                minLng={this.state.minLng}
                maxLng={this.state.maxLng}
                isDonation={!this.state.isRequest}/>
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
