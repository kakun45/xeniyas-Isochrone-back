const knex = require("knex")(require("../knexfile"));

// never tested, not used:
// exports.selectDBStations = (req, res) => {
//   // give it a bounding box
//   knex("nodes")
//   .select("node_id", "lng", "lat")
//   .whereBetween("lng", [req.params.minLon, req.params.maxLon])
//   .whereBetween("lat", [req.params.minLat, req.params.maxLat])
//   .then((rows) => {
//     if (!rows.length) {
//       return res
//       .status(404)
//       .send(
//         `minLon: ${req.params.minLon}, minLat: ${req.params.minLat} or maxLat/Lon were not found`
//         );
//       }
//       res.status(200).json(rows);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500);
//     });
//   };

exports.getBoundingBox = (center) => {
  const size = 0.006; // roughly a mile in degrees: 0.014
  const [lon, lat] = center;
  const minLon = lon - size;
  const minLat = lat - size;
  const maxLon = lon + size;
  const maxLat = lat + size;
  return [minLon, minLat, maxLon, maxLat];
};

/**
 * return the rows from the database, analog:
 * SELECT * FROM nodes
 * WHERE lat BETWEEN (40.748424-0.007) AND (40.748424+0.007)
 * AND lng BETWEEN (-73.985664-0.007) AND (-73.985664+0.007);
 * // returns [{...}]
 * @param {*} req
 * @param {*} res
 */
exports.getStationRowsInBoundingBox = async (boundingBox) => {
  const [minLon, minLat, maxLon, maxLat] = boundingBox; // x1,y1,x2,y2
  let rows = await knex("nodes")
    .select("node_id", "lng", "lat")
    .whereBetween("lng", [minLon, maxLon])
    .whereBetween("lat", [minLat, maxLat]);
  //console.log(`found ${rows.length} rows for ${boundingBox}`);
  //console.log(rows[0]);
  return rows; // returns [{...}]
};

async function getStationsWithDijkstra(center, minutes) {
  // const START_NODE_ID = "Start";
  const START_NODE_ID = "D15"; // rokefeller ctr

  // const graph = []
  // create graph by reading ea row of db edges and populatingthru .addEdge()
  //       edges have seconds:  turn seconds into minutes
  // get all within nodes within a bounding box
  // create walking edges from start to stations from scratch  .addEdge(nodeA, nodeB, cost)
  // cost will come from estimateMinutes(lng1, lat1, lng2, lat2)
  // TODO run dijkstra(START_NODE_ID, graph, maxCost)
  // {
  //   A: [ 'A', 0, null ],
  //   D: [ 'D', 1, 'A' ],
  //   E: [ 'E', 2, 'D' ],
  //   B: [ 'B', 3, 'D' ]
  // }
  // -> [nodeId, min-cost ...] turn nodeId into lat/lon

  // dijkstrasOutput.forEach() on this:
  function dijkstraOutputToStations(rowFromDijkstra, totalMinutes, nodes) {
    // rowFromDijkstra = one row from the return value from dijkstra, which is:  [nodeId, cost, prev]
    // totalMinutes = the total commute time the user entered in minutes
    // nodes = a list of nodes from the nodes table -- these have the lat-lon coordinates
    // 1. look up the lat/long of the nodeId
    // 2. subtract the node cost from totalMinutes to get minutes left over
    // 3. create and return this "station" object:
    // {
    //   longitude:...
    //   latitude: ...
    //   walk_minutes: ...
    // };
  }

  // [nodeId, cost, ...] => input_minutes - cost
  // turn into a station objects
  // this is JS obj that getAllGeometry that takes [{...}, {...}]
}

exports.originToArrOfStations = async (center, minutes) => {
  // give it [lat & lon] of start origin, and minutes;
  // return an arr of stations objects to put into getIso after
  const [lon, lat] = center;
  const start = {
    longitude: lon,
    latitude: lat,
    walk_minutes: minutes,
    // TODO there are more fields here
  };

  const USE_DIJKSTRA = false;

  if (USE_DIJKSTRA) {
    return getStationsWithDijkstra(); //todo inputs
  } else {
    const boundingBox = exports.getBoundingBox(center); // may go away, just to limit API calls
    rows = await exports.getStationRowsInBoundingBox(boundingBox);

    // replace this with station objects from dijkstra - cost
    let stations = rows.map((row) => {
      return {
        longitude: parseFloat(row.lng),
        latitude: parseFloat(row.lat),
        walk_minutes: parseInt(minutes), // todo replace minutes in here after calc
      };
    });

    stations.push(start);
    return stations;
  }
};
