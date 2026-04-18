const axios = require("axios");

const API_KEY = "e17e3e118cd34794a6bb306bd81efbbf";

const fetchNearby = async (lat, lng) => {
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