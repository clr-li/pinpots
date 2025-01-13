// components/Maps.js
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from '../assets/logopn.png'; // Update the path based on your structure

const locIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [38, 38],
});

const position = [47.6144219, -122.192337];

function ResetCenterView(props) {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true,
        }
      );
    }
  }, [selectPosition, map]);

  return null;
}

function Maps(props) {
  const { selectPosition, locations, onMarkerClick } = props;
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];

  return (
    <MapContainer
      center={position}
      zoom={8}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
            <Popup>{`${loc.name}`}</Popup>
          </Marker>
        ))}

      {selectPosition && (
        <Marker position={locationSelection} icon={locIcon}>
          <Popup>{locationSelection}</Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={selectPosition} />
    </MapContainer>
  );
}

export default Maps;