import { useState, useEffect } from "react";

function ContactsModal({ isOpen, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("contacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("contacts", JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!name || !phone) return;

    let updated;

    if (editId) {
      updated = contacts.map((c) =>
        c.id === editId ? { ...c, name, phone } : c
      );
      setEditId(null);
    } else {
      const newContact = {
        id: Date.now().toString(),
        name,
        phone,
      };
      updated = [...contacts, newContact];
    }

    setContacts(updated);
    saveToStorage(updated);
    setName("");
    setPhone("");
  };

  const handleEdit = (contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setEditId(contact.id);
  };

  const handleDelete = (id) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveToStorage(updated);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Emergency Contacts</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={handleAdd}>
          {editId ? "Update" : "Add"}
        </button>

        <ul>
          {contacts.map((c) => (
            <li key={c.id}>
              {c.name} ({c.phone})
              <button onClick={() => handleEdit(c)}>Edit</button>
              <button onClick={() => handleDelete(c.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
  },
};

export default ContactsModal;