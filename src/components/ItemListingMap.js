import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class ItemListingMap extends Component {
  constructor(props) {
  super(props);
    this.updateBounds = this.updateBounds.bind(this);
  }

  componentDidMount(){
    this.updateBounds();
  }

  componentDidUpdate(prevProps) {
    if (this.props.markerIdx !== prevProps.markerIdx && this.props.markerIdx !== -1 ) {
      let marker = this.refs[`marker-${this.props.markerIdx}`];
      marker.leafletElement.openPopup();
      this.props.clearMarkerIdx();
    }
  }

  updateBounds() {
    let map =  this.refs.ref.leafletElement;
    let mapBounds = map.getBounds();
    this.props.setMapBounds(mapBounds);
  }

  render () {
    let position = this.props.position;
    let zoom = "15";
    let style = { height: "60vh", width: "calc(100vw - 250px)", zIndex:"0" };

    return (
      <div id="mapid" className="item-listing-map">
        <Map
          ref="ref"
          center={position}
          zoom={zoom}
          style={style}
          onMoveEnd={this.updateBounds}
          doubleClickZoom={false}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
          </Marker>
          {
            this.props.mapItems && this.props.mapItems.map((item, idx) =>
            <Marker
              key={`marker-${idx}`}
              ref={`marker-${idx}`}
              position={[item.lat, item.lng]}>
              <Popup>
                <div>
                  {item.images.length > 0 ? (
                    <img src={item.images[0].url} alt={item.name} className="item-thumbnail"/>
                  ): ""}
                </div>
                <Link to={`category/${item.category.name}/${item.category.id}/${item.id}` } target="_blank">
                  {item.name}
                </Link>
                <div><i>{item.category.name}</i></div>
              </Popup>
            </Marker>
            )
          }
        </Map>
      </div>
    )
  }
}

export default ItemListingMap;
