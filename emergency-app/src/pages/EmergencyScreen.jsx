import { useLocation } from "react-router-dom";
import MapView from "../components/MapView";

function EmergencyScreen() {
  const { state } = useLocation();
  const location = state?.location;

  if (!location) {
    return <p>No location available</p>;
  }

  return (
    <div>
      <h2>Emergency Activated</h2>

      <MapView lat={location.lat} lng={location.lng} />

      <div style={{ padding: "10px" }}>
        <p>Lat: {location.lat}</p>
        <p>Lng: {location.lng}</p>
      </div>
    </div>
  );
}

export default EmergencyScreen;