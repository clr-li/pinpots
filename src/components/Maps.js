// Filename - Maps.js
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const locIcon = L.icon({
  iconUrl: './marker.png',
  iconSize: [38, 38],
});

const hereIcon = L.icon({
  iconUrl: './here.png',
  iconSize: [25.3951219512, 38],
});

const position = [47.6144219, -122.192337];

function ResetCenterView(props) {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(L.latLng(selectPosition?.lat, selectPosition?.lon), map.getZoom(), {
        animate: true,
      });
    }
  }, [selectPosition, map]);

  return null;
}

function Maps(props) {
  const { selectPosition, locations, onMarkerClick } = props;
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];

  return (
    <MapContainer center={position} zoom={8} style={{ width: '100%', height: '100%' }}>
      <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations &&
        locations.map((loc, index) => (
          <Marker
            key={'marker-' + index}
            position={[loc.lat, loc.lon]}
            icon={locIcon}
            eventHandlers={{
              click: () => onMarkerClick(loc),
            }}
          >
            <Popup>{`Location: ${loc.name}`}</Popup>
          </Marker>
        ))}

      {selectPosition && (
        <Marker position={locationSelection} icon={hereIcon}>
          <Popup>{locationSelection}</Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={selectPosition} />
    </MapContainer>
  );
}

export default Maps;
