const axios = require("axios");

const API_KEY = "e17e3e118cd34794a6bb306bd81efbbf";

const fetchNearby = async (lat, lng) => {

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  };
  try {
    const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital,service.police&filter=circle:${lng},${lat},5000&limit=20&apiKey=${API_KEY}`;

    const response = await axios.get(url);

    return response.data.features
      .map((item) => {
        const props = item.properties;

        return {
          id: props.place_id,
          lat: props.lat,
          lng: props.lon,
          name: props.name || props.address_line1 || "Nearby Service",
          distance: getDistance(lat, lng, props.lat, props.lon),
          type: props.categories?.includes("healthcare.hospital")
            ? "hospital"
            : props.categories?.includes("service.police")
            ? "police"
            : "other",
        };
      })
      .filter((item) => item.lat && item.lng);
  } catch (err) {
    return [];
  }
};

module.exports = { fetchNearby };