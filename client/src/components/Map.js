import React, { useEffect , useRef} from 'react';
import L from 'leaflet';
import {Marker, Popup, TileLayer } from 'react-leaflet';

function Map({ markerPosition }) {
  // create map
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    mapRef.current = L.map('map', {
      center: [49.8419, 24.0315],
      zoom: 16,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ]
    });
  }, []);
  
  // add marker
  const markerRef = React.useRef(null);
  React.useEffect(
    () => {
      if (markerRef.current) {
        markerRef.current.setLatLng(markerPosition);
      } else {
        markerRef.current = L.marker(markerPosition).addTo(mapRef.current);
      }
    },
    [markerPosition]
  );

  return <div id="map"></div>
}

export default Map;