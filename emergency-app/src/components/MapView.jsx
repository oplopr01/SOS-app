import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView({ lat, lng }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "60vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapView;