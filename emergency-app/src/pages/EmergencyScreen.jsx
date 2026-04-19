import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import { fetchNearbyServices } from "../services/api";

function EmergencyScreen() {
  const { state } = useLocation();
  const location = state?.location;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadData = async () => {
    if (!location) return;

    try {
     const data = await fetchNearbyServices(
        location.lat,
        location.lng
      );
if (Array.isArray(data)) {
        setServices(data);
      } else {
        setServices([]);
      }

    } catch (err) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [location]);
  if (!location) return <p>No location</p>;
  if (!navigator.onLine) {
  return (
    <div>
      <h2>Offline Mode</h2>
      <p>Call emergency number immediately</p>
      <a href="tel:112">Call 112</a>
    </div>
  );
}

  return (
    <div>
      <h2>Emergency Activated</h2>

      <MapView lat={location.lat} lng={location.lng} services={services} />

      {loading ? (
        <p>Loading nearby services...</p>
      ) : (
        <ul>
            {Array.isArray(services) && services.length > 0 ? (
              services .slice()
  .sort((a, b) => a.distance - b.distance).map((s) => (
                <li key={s.id}>
      {s.name} ({s.type}) - {s.distance} km  <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Navigate
      </a>
                </li>
                
              ))
            ) : (
              <p>No nearby services found</p>
            )}
        </ul>
      )}
    </div>
  );
}

export default EmergencyScreen;