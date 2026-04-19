import { useNavigate } from "react-router-dom";
import { getUserLocation } from "../services/location";

function SOSButton() {
  const navigate = useNavigate();

  const handleSOS = async () => {
    try {
      const location = await getUserLocation();

      navigate("/emergency", { state: { location } });
    } catch (err) {
      alert("Unable to fetch location: " + err);
    }
  };

  return (
    <button style={styles.button} onClick={handleSOS}>
      SOS
    </button>
  );
}

const styles = {
  button: {
  backgroundColor: "red",
  color: "white",
  fontSize: "40px",
  padding: "60px",
  borderRadius: "50%",
  border: "none",
}
};

export default SOSButton;