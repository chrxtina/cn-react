  import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from './MarkerClusterGroup';

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
      let map =  this.refs.ref.leafletElement;
      let marker = this.refs[`marker-${this.props.markerIdx}`].leafletElement;
      let clusterGroup = this.refs['mkr-cluster-grp'].leafletElement;
      let popup = marker.getPopup();

      if (map.hasLayer(marker) && !popup.isOpen()) {
        marker.openPopup();
      } else {
        if (clusterGroup.hasLayer(marker)) {
          clusterGroup.zoomToShowLayer(marker, function() {
              marker.openPopup();
          });
        }
      }
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
    let zoom = "14";
    let maxZoom = "16"
    let minZoom = "4";
    let style = { height: "100%", width: "100%", zIndex:"0" };

    return (
      <div id="mapid" className="item-listing-map">
        <Map
          ref="ref"
          center={position}
          zoom={zoom}
          maxZoom={maxZoom}
          minZoom={minZoom}
          style={style}
          onMoveEnd={this.updateBounds}
          doubleClickZoom={false}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            icon={L.divIcon({className: "pulseIcon"})}
            >
          </Marker>
          <MarkerClusterGroup
            ref="mkr-cluster-grp"
            disableClusteringAtZoom={maxZoom}
            spiderfyOnMaxZoom={false}>
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
                  <Link to={`/item/${item.id}` } target="_blank">
                    {item.name}
                  </Link>
                  <div><i>{item.category.name}</i></div>
                </Popup>
              </Marker>
              )
            }
          </MarkerClusterGroup>
        </Map>
      </div>
    )
  }
}

export default ItemListingMap;
