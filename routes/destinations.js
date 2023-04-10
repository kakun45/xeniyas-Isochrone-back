const express = require("express");
const {
  getIso,
  getAllGeometry,
  readData,
  readAnotherData,
  readGeometryCollection,
} = require("../controllers/other");
const router = express.Router();
const {
  getStationRowsInBoundingBox,
  getBoundingBox,
  originToArrOfStations,
} = require("../controllers/knexController");

// router.route("/destinations").get(knexController.index);
// HTTP body { “shapes” : [ { type: “circle”, lat: 57.6879, lon: -36.4675, radius: NUMBER } … ] }

// GET geometeries to emitate the res of API;
// to use: http://localhost:8080/api/v1/destinations
router.get("/", (_req, res) => {
  const data = readData();
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json("file is not found");
  }
});

// GET geometeries to emitate the res of API;
// to use: http://localhost:8080/api/v1/destinations/2
router.get("/2", (_req, res) => {
  const anotherIso = readAnotherData();
  if (anotherIso) {
    res.status(200).json(anotherIso);
  } else {
    res.status(404).json("file is not found");
  }
});

// GET geometeries to emitate the res of API;
// to use: http://localhost:8080/api/v1/destinations/collection
router.get("/collection", (_req, res) => {
  const collectionData = readGeometryCollection();
  if (collectionData) {
    res.status(200).json(collectionData);
  } else {
    res.status(404).json("Data file is not found");
  }
});

router.get("/test-one", async (_req, res) => {
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
  } catch (err) {
    res.send(err);
  }
});

// this was created to test the geometry-merging code
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
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json("file is not found");
    }
  } catch (err) {
    res.send(err);
  }
});

// pass 3 vals to this api
// to use: http://localhost:8080/api/v1/destinations/commute-one
router.post("/commute-one", async (req, res) => {
  try {
    const { center, inputValue } = req.body; // { center: [ -73.985664, 40.748424 ], inputValue: 16 }
    const station = {
      longitude: center[0],
      latitude: center[1],
      walk_minutes: inputValue,
    };
    const result = await getIso(station);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json("Station is not found");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

// pass 2+1 vals to this api
// to use: http://localhost:8080/api/v1/destinations/commute-all
router.post("/commute-all", async (req, res) => {
  try {
    console.log(139, req.body);
    const { center, inputValue } = req.body; // { center: [ -73.985664, 40.748424 ], inputValue: 16 }
    const stations = await originToArrOfStations(center, parseInt(inputValue));
    const results = await getAllGeometry(stations);

    console.log("worked", results);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/points", async (req, res) => {
  const EMPIRE = [-73.985664, 40.748424];
  const boundingBox = getBoundingBox(EMPIRE);
  const walkMinutes = 15;

  try {
    // worked:
    // results = await getStationRowsInBoundingBox(boundingBox);
    results = await originToArrOfStations(EMPIRE, walkMinutes);

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

// Export this module
module.exports = router;
