import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView({ lat, lng, services = [] }) {
  return (
    <MapContainer center={[lat, lng]} zoom={14} style={{ height: "60vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[lat, lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {services.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]}>
          <Popup>
            {s.name} ({s.type})
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;