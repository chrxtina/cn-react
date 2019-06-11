import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

class NewItemMap extends Component {

  constructor (props) {
    super(props);
    this.state = {
      position: null
    };
  }

  componentDidMount() {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      autoClose: true,
      keepResult: true,
      autoCompleteDelay: 300,
      style: 'bar',
      marker: {
        draggable: true
      }
    });

    let map =  this.refs.ref.leafletElement;
    map.addControl(searchControl);
    map.on('geosearch/showlocation', (result) => {
      this.props.setCoords(result.location.y, result.location.x);
    });
    map.on('geosearch/marker/dragend', (result => {
      this.props.setCoords(result.location.y, result.location.x);
      console.log(result.location)
    }))
  }

  render () {
    let position = [42.366560, -71.092700];
    let zoom = "17";
    let maxZoom="18";
    let style = { height: "400px", width: "600px" };

    return (
      <div id="mapid" className="new-item-map">
        <Map
          ref="ref"
          center={position}
          zoom={zoom}
          maxZoom={maxZoom}
          style={style}
          doubleClickZoom={false}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    )
  }
}

export default NewItemMap;
