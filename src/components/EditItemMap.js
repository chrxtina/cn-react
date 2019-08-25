import React, { Component } from 'react';
import { Map, TileLayer, FeatureGroup, CircleMarker } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-draw/dist/leaflet.draw.css';

class EditItemMap extends Component {

  constructor (props) {
    super(props);
    this.state = {
      position: [this.props.lat, this.props.lng],
      circleActive: true
    };
  }

  componentDidMount() {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      autoClose: true,
      autoCompleteDelay: 300,
      style: 'bar',
    });

    let map =  this.refs.ref.leafletElement;
    map.addControl(searchControl);
  }

  _onCreated = (e) => {
    this.props.setCoords(e.layer._latlng.lat, e.layer._latlng.lng);
    this.setState({
      circleActive: true
    });
  }

  _onEdited = (e) => {
    e.layers.eachLayer( (layer) => {
      this.props.setCoords(layer._latlng.lat, layer._latlng.lng);
    });
  }

  _onDeleted = (e) => {
    this.setState({
      circleActive: false
    });
  }

  render () {
    let position = this.state.position;
    let zoom = "16";
    let maxZoom="17";
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
          <FeatureGroup>
            <EditControl
              position='bottomleft'
              onEdited={this._onEdited}
              onCreated={this._onCreated}
              onDeleted={this._onDeleted}
              draw={{
                polyline: false,
                polygon: false,
                rectangle: false,
                marker: false,
                circle: false,
                circlemarker: this.state.circleActive === false ? {radius: 150} : false
              }}
              edit={{
                remove: true
              }}
            />
            <CircleMarker center={position} radius={150} />
          </FeatureGroup>
        </Map>
      </div>
    )
  }
}

export default EditItemMap;
