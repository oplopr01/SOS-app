const express = require("express");
const cors = require("cors");
const emergencyRoute = require("./routes/emergency");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/emergency", emergencyRoute);
app.get("/", (req, res) => {
  res.send("Server running");
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});