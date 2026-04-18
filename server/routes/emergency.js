const express = require("express");
const router = express.Router();

// ✅ Use Geoapify service
const { fetchNearby } = require("../services/places");

router.post("/", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.json([]);
    }

    const data = await fetchNearby(lat, lng);

    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    res.json([]); // always safe
  }
});

module.exports = router;