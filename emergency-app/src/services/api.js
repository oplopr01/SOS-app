export const fetchNearbyServices = async (lat, lng) => {
  const res = await fetch("http://localhost:5000/emergency", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lng }),
  });

  return res.json();
};