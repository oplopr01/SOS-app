export const fetchNearbyServices = async (lat, lng) => {
  const res = await fetch("https://sos-app-be.onrender.com/emergency", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lng }),
  });

  return res.json();
};