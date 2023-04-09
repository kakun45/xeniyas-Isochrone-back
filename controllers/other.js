const fs = require("fs");
const axios = require("axios");

// One station data for testing
const readData = () => {
  // WARNING! only one "dot/<path>" routs on data, bc we call it from index.js, not from here
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

/**
 *  makes external calls forEach in arr of Stations, turness calls into the Promises and assembles the file with all the isocrones layers
 *   // example:
  // {
  //   type: 'GeometryCollection',
  //   geometries: [
  //     { coordinates: [Array], type: 'Polygon' },
  //     { coordinates: [Array], type: 'Polygon' },
  //     { coordinates: [Array], type: 'Polygon' }
  //   ]
  // }
  @param {*} stations arr
 * @returns 
 */
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
  dataHead.features[0].geometry = isoCollectionLayer;
  return dataHead;
}

/**
 * the obj of Nodes and Edges to seed db
 * @returns nodes/edges data from json
 */
const readNodes = () => {
  return JSON.parse(fs.readFileSync("./data/nodes_nodup.json"));
};
const readEdges = () => {
  return JSON.parse(fs.readFileSync("./data/edges_nodup_rounded.json"));
};

module.exports = {
  getIso,
  getAllGeometry,
  readAnotherData,
  readData,
  readEdges,
  readGeometryCollection,
  readNodes,
};
