const express = require("express");
const { readData } = require("../controllers/other");
const router = express.Router();

// router.route("/api/v1/destinations").get(knexController.index);
// HTTP body { “shapes” : [ { type: “circle”, lat: 57.6879, lon: -36.4675, radius: NUMBER } … ] }

// GET geometeries to emitate the res of API; to use: http://localhost:8080/destinations
router.get("/", (_req, res) => {
  const data = readData();
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json("file is not found");
  }
});

// Export this module
module.exports = router;
