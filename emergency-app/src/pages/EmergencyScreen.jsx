import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import { fetchNearbyServices } from "../services/api";

function EmergencyScreen() {
  const { state } = useLocation();
  let location = state?.location;

  if (!location) {
    const saved = localStorage.getItem("lastLocation");
    if (saved) {
      location = JSON.parse(saved);
    }
  }

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  // Load contacts
  useEffect(() => {
    const saved = localStorage.getItem("contacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  // Fetch services + store location
  useEffect(() => {
    if (location) {
      localStorage.setItem(
        "lastLocation",
        JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          timestamp: Date.now(),
        })
      );
    }

    const loadData = async () => {
      if (!location || !navigator.onLine) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchNearbyServices(
          location.lat,
          location.lng
        );
        setServices(Array.isArray(data) ? data : []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location]);

  // No location fallback
  if (!location) {
    return (
      <div>
        <h2>Emergency Mode</h2>
        <p>No location data available.</p>
        <a href="tel:112">📞 Call 112</a>
      </div>
    );
  }

  // WhatsApp per contact
  const handleWhatsAppAlert = (contact) => {
    const message = `🚨 EMERGENCY 🚨
I need help immediately.
My location: https://maps.google.com/?q=${location.lat},${location.lng}`;

    const url = `https://wa.me/91${contact.phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div>
      <h2>Emergency Activated</h2>

      {/* 🔹 Offline indicator (same logic as before) */}
      {!navigator.onLine && (
        <p style={{ color: "orange" }}>
          ⚠️ You are offline. Showing last known location.
        </p>
      )}

      {/* 🔹 Call 112 */}
      <a href="tel:112" style={styles.callBtn}>
        📞 Call Emergency (112)
      </a>

      {/* 🔹 Contacts with WhatsApp */}
      {contacts.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h4>Quick Contacts</h4>

          {contacts.map((c) => (
            <div key={c.id} style={styles.contactRow}>
              <a href={`tel:${c.phone}`} style={styles.callSmallBtn}>
                📞 {c.name}
              </a>

              <button
                onClick={() => handleWhatsAppAlert(c)}
                style={styles.whatsappSmallBtn}
              >
                📤 WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Map */}
      <MapView lat={location.lat} lng={location.lng} services={services} />

      {/* 🔹 Services */}
      {loading ? (
        <p>Loading nearby services...</p>
      ) : (
        <ul style={{ textAlign: "left" }}>
          {services.length > 0 ? (
            services
              .slice()
              .sort((a, b) => a.distance - b.distance)
              .map((s) => (
                <li key={s.id}>
                  {s.name} ({s.type}) - {s.distance} km{" "}
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`,
                        "_blank"
                      )
                    }
                  >
                    Navigate
                  </button>
                  <div>--------------------------------------</div>
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

/* 🔹 Styles */
const styles = {
  callBtn: {
    display: "block",
    margin: "5px 0",
    padding: "6px",
    background: "red",
    color: "white",
    textAlign: "center",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },

  contactRow: {
    display: "flex",
    gap: "4px",
    marginBottom: "6px",
  },

  callSmallBtn: {
    flex: 1,
    padding: "7px",
    background: "#eee",
    borderRadius: "5px",
    textDecoration: "none",
    color: "black",
    textAlign: "center",
    fontSize: "13px",
  },

  whatsappSmallBtn: {
    flex: 1,
    padding: "7px",
    background: "#25D366",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default EmergencyScreen;