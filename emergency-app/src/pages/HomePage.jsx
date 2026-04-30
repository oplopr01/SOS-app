import SOSButton from "../components/SOSButton";
import { useState, useEffect } from "react";
import ContactsModal from "../components/ContactsModal";

function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [contactsCount, setContactsCount] = useState(0);

  // Load contacts count
  useEffect(() => {
    const saved = localStorage.getItem("contacts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setContactsCount(parsed.length);
    }
  }, [openModal]); // refresh when modal opens/closes

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        🚨<br />Emergency Assistant
      </h1>

      <p style={styles.subtitle}>
        Get immediate help during emergencies with one tap.
      </p>

      <div style={styles.infoBox}>
        <p><strong>How it helps:</strong></p>

        <ul style={{ paddingLeft: "18px" }}>
          <li>📍 Detects your current location</li>
          <li>🏥 Shows nearest hospitals & police stations</li>
          <li>🗺️ Provides navigation instantly</li>
          <li>📞 One-tap call to emergency services</li>
        </ul>

        <button
          onClick={() => setOpenModal(true)}
          style={styles.contactBtn}
        >
          ➕ Manage Emergency Contacts ({contactsCount})
        </button>
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
    color: "white",
  },

  instruction: {
    marginBottom: "20px",
    fontWeight: "bold",
  },

  contactBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#25D366",
    color: "white",
    cursor: "pointer",
  },
  title: {
  textAlign: "center",
  width: "100%",
  fontSize: "20px",
  lineHeight: "1.3",
  wordBreak: "break-word",
  marginBottom: "10px",
},
};

export default HomePage;