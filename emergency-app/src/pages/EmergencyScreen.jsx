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

  return (
    <div>
      <h2>Emergency Activated</h2>

      <MapView lat={location.lat} lng={location.lng} services={services} />

      {loading ? (
        <p>Loading nearby services...</p>
      ) : (
        <ul>
            {Array.isArray(services) && services.length > 0 ? (
              services.map((s) => (
                <li key={s.id}>
                  {s.name} ({s.type})
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