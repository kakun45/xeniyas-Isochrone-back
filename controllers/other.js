const fs = require("fs");
const axios = require("axios");

// One station data for testing
const readData = () => {
  // WARNING! only one "dot/<path>" routs on data, bc we call it from index.js, not from here
  // console.log(JSON.parse(fs.readFileSync("./data/one_call_geometries.json")));
  return JSON.parse(fs.readFileSync("./data/one_call_geometries.json"));
};

// another station data for testing
const readAnotherData = () => {
  return JSON.parse(fs.readFileSync("./data/lexington_geometries.json"));
};

const readGeometryCollection = () => {
  return JSON.parse(fs.readFileSync("./data/geometry_collection.json"));
};

async function getIso(station) {
  const { longitude, latitude, walk_minutes } = station;
  let profile = "walking";
  const response = await axios.get(
    `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${longitude},${latitude}?contours_minutes=${walk_minutes}&polygons=true&access_token=${process.env.ACCESS_TOKEN}`
  );
  // obj with "coordinates" arr and "type": "Polygon"
  return response.data.features[0].geometry;
}

// makes external calls forEach in arr of Stations, turness calls into the promises and assembles the file with all the isocrones layers
async function getAllGeometry(stations) {
  const dataHead = JSON.parse(fs.readFileSync("./data/sceleton_res.json"));

  const isoCollectionLayer = {
    type: "GeometryCollection",
    geometries: [],
  };

  let promises = [];
  stations.forEach((station) => {
    let promise = getIso(station);
    promises.push(promise);
  });

  let listOfResponses = await Promise.all(promises);
  listOfResponses.forEach((iso) => {
    isoCollectionLayer.geometries.push(iso);
  });
  // example:
  // {
  //   type: 'GeometryCollection',
  //   geometries: [
  //     { coordinates: [Array], type: 'Polygon' },
  //     { coordinates: [Array], type: 'Polygon' },
  //     { coordinates: [Array], type: 'Polygon' }
  //   ]
  // }

  // console.log("other ", dataHead.features[0].geometry);
  dataHead.features[0].geometry = isoCollectionLayer;
  return dataHead;
}

module.exports = {
  getIso,
  getAllGeometry,
  readData,
  readAnotherData,
  readGeometryCollection,
};
