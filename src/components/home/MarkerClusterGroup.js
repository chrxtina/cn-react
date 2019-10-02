import { MapLayer, withLeaflet } from "react-leaflet";
import L from "leaflet";
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

require("leaflet.markercluster");

class MarkerClusterGroup extends MapLayer {

  createLeafletElement(props) {
    const el = new L.markerClusterGroup(props);
    this.contextValue = {
      ...props.leaflet,
      layerContainer: el
    };
    return el;
  }
}

export default withLeaflet(MarkerClusterGroup);
