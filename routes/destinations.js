const express = require("express");

// const { index } = require("../controllers/knexController"); // todo
const {
  getIso,
  getAllGeometry,
  readData,
  readAnotherData,
  readGeometryCollection,
} = require("../controllers/other");
const { response } = require("express");
const router = express.Router();

// todo
// router.route("/destinations").get(knexController.index);
// HTTP body { “shapes” : [ { type: “circle”, lat: 57.6879, lon: -36.4675, radius: NUMBER } … ] }

// GET geometeries to emitate the res of API; to use: http://localhost:8080/api/v1/destinations
router.get("/", (_req, res) => {
  const data = readData();
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json("file is not found");
  }
});
// GET geometeries to emitate the res of API; to use: http://localhost:8080/api/v1/destinations/2
router.get("/2", (_req, res) => {
  const anotherIso = readAnotherData();
  if (anotherIso) {
    res.status(200).json(anotherIso);
  } else {
    res.status(404).json("file is not found");
  }
});

// GET geometeries to emitate the res of API; to use: http://localhost:8080/api/v1/destinations/collection
router.get("/collection", (_req, res) => {
  const collectionData = readGeometryCollection();
  if (collectionData) {
    res.status(200).json(collectionData);
  } else {
    res.status(404).json("file is not found");
  }
});

router.get("/test", async (_req, res) => {
  // const { profile, contours_minutes, longitude, latitude } = obj;
  let contours_minutes = 10;
  let longitude = -73.980255;
  let latitude = 40.76539;
  const station = {
    longitude: longitude,
    latitude: latitude,
    walk_minutes: contours_minutes,
  };
  try {
    result = await getIso(station);
    res.send(result);
    // next();
  } catch (err) {
    next(err);
    res.send(err);
  }
});

router.get("/test-all", async (_req, res) => {
  const dummyStationData = [
    {
      station_name: "7th Ave",
      color: "#E74725",
      longitude: -73.980255,
      latitude: 40.76539,
      walk_minutes: 5,
    },
    // {
    //   station_name: "59th St Columbus Circle",
    //   color: "#32a852",
    //   longitude: -73.981908,
    //   latitude: 40.768398,
    //   walk_minutes: 10,
    // },
    {
      station_name: "Lexington Ave-59th st",
      color: "#428cdb",
      longitude: -73.967455,
      latitude: 40.762756,
      walk_minutes: 12,
    },
    // {
    //   station_name: "Roosevelt Island",
    //   color: "#dbab42",
    //   longitude: -73.95308,
    //   latitude: 40.759072,
    //   walk_minutes: 10,
    // },
  ];

  try {
    const result = await getAllGeometry(dummyStationData);
    // res.send(result);
    if (result) {
      res.status(200).json(result);
      // next();
    } else {
      res.status(404).json("file is not found");
      // next();
    }
  } catch (err) {
    // next(err);
    res.send(err);
  }
});

// Export this module
module.exports = router;
