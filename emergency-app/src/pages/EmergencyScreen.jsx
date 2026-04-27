import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import { fetchNearbyServices } from "../services/api";

function EmergencyScreen() {
  const { state } = useLocation();
  const [userInput, setUserInput] = useState("");
  const [emergencyType, setEmergencyType] = useState("general");

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
  const [isListening, setIsListening] = useState(false);

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

  // AI detection
  useEffect(() => {
    if (!userInput) {
      setEmergencyType("general");
      return;
    }

    const type = detectEmergencyType(userInput);
    setEmergencyType(type);
  }, [userInput]);

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

  // Detection logic (FIXED)
  const detectEmergencyType = (text) => {
    const msg = text.toLowerCase();

    if (
      msg.includes("accident") ||
      msg.includes("injury") ||
      msg.includes("hurt")
    )
      return "medical";

    if (msg.includes("fire") || msg.includes("burn"))
      return "fire";

    if (
      msg.includes("police") ||
      msg.includes("robbery") ||
      msg.includes("attack") ||
      msg.includes("theft")
    )
      return "police";

    return "general";
  };

  // Smart sorting
  const sortedServices = services
    .slice()
    .sort((a, b) => {
      if (emergencyType === "medical") {
        if (a.type === "hospital" && b.type !== "hospital") return -1;
        if (b.type === "hospital" && a.type !== "hospital") return 1;
      }

      if (emergencyType === "police") {
        if (a.type === "police" && b.type !== "police") return -1;
        if (b.type === "police" && a.type !== "police") return 1;
      }

      return a.distance - b.distance;
    });

 const startVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();
  setIsListening(true); // 🔴 START

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    setUserInput(text);
  };

  recognition.onend = () => {
    setIsListening(false); // 🟢 STOP
  };

  recognition.onerror = () => {
    setIsListening(false);
  };
};

  return (
    <div>
      <h2>Emergency Activated</h2>

      {!navigator.onLine && (
        <p style={{ color: "orange" }}>
          ⚠️ You are offline. Showing last known location.
        </p>
      )}

      {/* Call 112 */}
      <a href="tel:112" style={styles.callBtn}>
        📞 Call Emergency (112)
      </a>

      {/* Contacts */}
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

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Describe your situation (e.g., accident, fire)"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={startVoiceInput}
          style={{
            ...styles.micBtn,
            background: isListening ? "red" : "#333",
          }}
        >
          {isListening ? "🔴 Listening" : "🎤"}
        </button>
      </div>
      {isListening && (
        <p style={{ color: "red", fontSize: "12px" }}>
          Listening... Speak now
        </p>
      )}
      {/* AI Instructions */}
       {emergencyType === "fire" && (
        <p style={styles.alert}>🔥 Fire emergency detected.</p>
      )}
      {emergencyType === "medical" && (
        <p style={styles.alert}>🩺 Medical emergency detected.</p>
      )}
      {emergencyType === "police" && (
        <p style={styles.alert}>🚓 Police assistance recommended.</p>
      )}

      {/* Reason */}
      {emergencyType !== "general" && (
        <p style={styles.reason}>
          Showing prioritized results for: <b>{emergencyType}</b>
        </p>
      )}

      {/* Highlight */}
      {sortedServices.length > 0 && (
        <div style={styles.highlightBox}>
          <strong>⭐ Recommended:</strong><br />
          {sortedServices[0].name} ({sortedServices[0].type})<br />
          {sortedServices[0].distance} km away
        </div>
      )}

      {/* Map */}
      <MapView lat={location.lat} lng={location.lng} services={services} />

      {/* Services */}
      {loading ? (
        <p>Loading nearby services...</p>
      ) : (
        <ul style={{ textAlign: "left" }}>
          {sortedServices.length > 0 ? (
            sortedServices.map((s) => (
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
    textAlign: "center",
    textDecoration: "none",
    color: "black",
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

  input: {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  alert: {
    color: "red",
    fontSize: "14px",
  },

  reason: {
    fontSize: "13px",
    color: "gray",
  },

  highlightBox: {
    background: "#fff3cd",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    border: "1px solid #ffeeba",
  },
  inputRow: {
  display: "flex",
  gap: "6px",
  alignItems: "center",
},

micBtn: {
  padding: "8px",
  borderRadius: "6px",
  border: "none",
  background: "#333",
  color: "white",
  cursor: "pointer",
}
};

export default EmergencyScreen;