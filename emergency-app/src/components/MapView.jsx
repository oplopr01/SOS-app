import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function MapView({ lat, lng, services = [] }) {

  const userIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
  });

  const serviceIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [32, 32],
  });
  return (
    <MapContainer center={[lat, lng]} zoom={14} style={{ height: "60vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User Location */}
      <Marker position={[lat, lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Nearby Services */}
      {services
        .filter((s) => s.lat && s.lng)
        .map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={serviceIcon}>
            <Popup>{s.name}</Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default MapView;