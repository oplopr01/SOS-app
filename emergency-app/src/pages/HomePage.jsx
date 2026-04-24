import SOSButton from "../components/SOSButton";
import { useState } from "react";
import ContactsModal from "../components/ContactsModal";
function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div style={styles.container}>
      <h1>🚨 Emergency Assistant</h1>

      <p style={styles.subtitle}>
        Get immediate help during emergencies with one tap.
      </p>

      <div style={styles.infoBox}>
        <p><strong>How it helps:</strong></p>
        <ul>
          <button onClick={() => setOpenModal(true)}>
            Manage Contacts
          </button>
          <li>📍 Detects your current location</li>
          <li>🏥 Shows nearest hospitals & police stations</li>
          <li>🗺️ Provides navigation instantly</li>
          <li>📞 One-tap call to emergency services</li>
        </ul>
      </div>

      <p style={styles.instruction}>
        Tap the SOS button below to get help instantly.
      </p>

      <SOSButton />
      <p style={{ fontSize: "12px", color: "gray" }}>
        ⚠️ Allow location access for accurate results
      </p>

      <ContactsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    textAlign: "center",
  },

  subtitle: {
    fontSize: "16px",
    marginBottom: "10px",
  },

  infoBox: {
    background: "#453e3e",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    textAlign: "left",
    maxWidth: "300px",
  },

  instruction: {
    marginBottom: "20px",
    fontWeight: "bold",
  },
};

export default HomePage;