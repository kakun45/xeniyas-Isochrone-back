const environment = process.env.ENVIRONMENT || "devep";
const knex = require("knex")(require("../knexfile")[environment]); //  creating the instance of Knex to use in the application
const {
  dijkstra,
  estimateMinutesFromLatLon,
  Graph,
} = require("./getAllDestinations");

exports.getBoundingBox = (center) => {
  // roughly a 1-mile in degrees: 0.022(at the equator) However, this distance decreases as you move towards the poles.
  // At a latitude of 40.74590600 degrees, one mile is approximately 0.021366 degrees. ex. is from the 23rd st station Lat
  const size = 0.01; // room for improvement: v1.1 how long user wants to walk to origin Subway station
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
 * @param {*} req
 * @param {*} res
 * @returns [{...}]
 */
exports.getStationRowsInBoundingBox = async (boundingBox) => {
  const [minLon, minLat, maxLon, maxLat] = boundingBox; // x1,y1,x2,y2
  let rows = await knex("nodes")
    .select("node_id", "lng", "lat")
    .whereBetween("lng", [minLon, maxLon])
    .whereBetween("lat", [minLat, maxLat]);
  //console.log(`found ${rows.length} rows for ${boundingBox}`);
  //console.log(rows[0]);
  return rows;
};

// const START_NODE_ID = "D15"; // Rokefeller ctr
const START_NODE_ID = "Start";
const WAIT_TIME_MIN_AT_START_STATION = 5;

async function calulateStartEdges(startLatLon, startNodeId, graph) {
  // get all Stations' nodes within a bounding box exports.getBoundingBox(center)
  const boundingBox = exports.getBoundingBox(startLatLon); // [lon, lat] = startLatLon
  rows = await exports.getStationRowsInBoundingBox(boundingBox);
  // console.log(48, rows); // [{ node_id: '633', lng: '-73.98426400', lat: '40.74307000' },...]
  if (!rows) {
    console.warn(
      "I found No Subway stations within walking distance in your given time"
    );
  }
  const [lng, lat] = startLatLon; // assuming lng1, lat1, come in as Numbers
  if (typeof lng !== "number" || typeof lat !== "number") {
    throw new Error(`lon & lat must be a Float, got lng: ${lng}, lat${lat}`);
  }
  // create from scratch and add to the graph walking edges from Start to originStations: graph.addEdge(nodeA, nodeB, cost)
  rows.map((row) => {
    // cost will come from estimateMinutesFromLatLon(lng1, lat1, lng2, lat2)
    const cost = estimateMinutesFromLatLon(
      lng,
      lat,
      parseFloat(row.lng),
      parseFloat(row.lat)
    );
    // return edges OR modify graph;
    graph.addEdge(startNodeId, row.node_id, cost); // form: graph.addEdge(nodeA, nodeB, cost)
  });
}

async function getStationsWithDijkstra(center, maxCostMin) {
  const myGraph = new Graph();
  // create graph by reading db 'edges' and populating ea row thru .addEdge()
  const rows = await knex("edges"); // default: .select("*")
  // console.log(typeof rows, rows);
  // object [
  //   { node_a: '101', node_b: '103', avg_travel_sec: 264 },..
  // ]
  rows.forEach((row) => {
    //  - edges in db have seconds:  turn seconds into minutes: avg_travel_sec/60
    myGraph.addEdge(row.node_a, row.node_b, row.avg_travel_sec / 60);
  });

  // myGraph.getAllNodeIds()); // ['101', '103', '104', '106', ... 396+ more items ]
  // myGraph.getEdges("101")); //  [ Edge { neighboorId: '103', cost: 4.4 } ]

  if (!(myGraph instanceof Graph)) {
    throw new Error("myGraph is not an instance of the Graph class");
  }
  await calulateStartEdges(center, START_NODE_ID, myGraph);
  console.log(95, myGraph.getAllNodeIds());
  // need to substruct from maxConstMin - WAIT_TIME_MIN_AT_START_STATION - a waiting for a 1st trin time at the "Start" station
  const dijkstrasNodes = dijkstra(
    START_NODE_ID,
    myGraph,
    maxCostMin - WAIT_TIME_MIN_AT_START_STATION
  ); // maxCostMin is input user minutes, need 'startNodeId', not [lat,lng]
  // console.log(101, dijkstrasNodes);
  // Output sample with db run:
  // {
  // D15: [ 'D15', 0, null ],
  // D14: [ 'D14', 2.1, 'D15' ],
  // F12: [ 'F12', 2.1666666666666665, 'D15' ], ...
  // }
  // output -> [nodeId, min-cost, prev] turn nodeId into lat&lon with call to db
  const keysOfDijkstrasNodes = Object.keys(dijkstrasNodes); // arr
  try {
    const rowsWithLatLon = await knex("nodes").select("node_id", "lng", "lat");
    // the retrieved rows are accessible in here
    // console.log(111, `rowsWithLatLon.length=${rowsWithLatLon.length}`);
    const stations = [];
    // console.log(
    // `114. just created stations array: size=${stations.length} dijkstrasNodes.length=${dijkstrasNodes.length} `
    // );
    // Output: [
    //  { node_id: 'A24', lng: '-73.98173600', lat: '40.76829600' }, ...
    // ]
    for (const nodeId in dijkstrasNodes) {
      // console.log(`for loop nodeId=${nodeId} stations array size=${stations.length}`);
      // create a node (center) for the start location
      if (nodeId === START_NODE_ID) {
        // create start obj and add to [stations]
        const startObj = {
          longitude: center[0],
          latitude: center[1],
          walk_minutes: Math.round(maxCostMin),
        };
        stations.push(startObj);
      } else {
        const rowFromDijkstra = dijkstrasNodes[nodeId];
        // console.log(132, rowFromDijkstra); // [arr] that is set on ea key: [ 'D15', 0, null ]
        const node = rowsWithLatLon.find((node) => node.node_id === nodeId);
        // turn into a station objects, the obj that getAllGeometry() takes: [{...}, {...}]
        const stationObj = dijkstraOutputToStations(
          rowFromDijkstra,
          maxCostMin,
          node
        );
        stations.push(stationObj);
        // Output: [{
        //   longitude: '-73.97745000',
        //   latitude: '40.76397200',
        //   walk_minutes: 8 // "contours_minutes must be an integer" will convert in dijkstraOutputToStations()
        // }, ...]
      }
    }
    // console.log(`156. getStationsWithDijkstra() returning: ${stations}.`);
    return stations;
  } catch (error) {
    console.error(error);
  }
  // WARNING! console.log(rowsWithLatLon); // if called here: ReferenceError: rowsWithLatLon is not defined
}

/**
 *   // rowFromDijkstra = one row from the return value from dijkstra, which is:  [nodeId, cost, prev]
  // totalMinutes = the total commute time the user entered in minutes
  // node = obj/row from the 'nodes' table -- these have the ids, lat-lon coordinates  { node_id: 'D18', lng: '-73.99282100', lat: '40.74287800' }
  // 1. look up the lat/long of the nodeId
  // 2. subtract the node cost from totalMinutes to get minutes left over
  //      [nodeId, cost, ...] => input_minutes - cost
  // 3. create and return this form "station" object:
  // {
  //   longitude:...
  //   latitude: ...
  //   walk_minutes: ... // MAPBOX {"message": "contours_minutes must be an integer","code": "InvalidInput"}
  // };
 * @param {*} rowFromDijkstra = [ 'B08', 5.800000000000001, 'B10' ]
 * @param {*} totalMinutes int max commute from a user input
 * @param {*} node = { node_id: 'A24', lng: '-73.98173600', lat: '40.76829600' }
 * @returns one station obj
 */
function dijkstraOutputToStations(rowFromDijkstra, totalMinutes, node) {
  return {
    longitude: node.lng,
    latitude: node.lat,
    walk_minutes: Math.round(totalMinutes - rowFromDijkstra[1]),
  };
}

/**
 *  give it [lat & lon] of start origin, and minutes;
 * @param {*} center
 * @param {*} minutes
 * @returns an arr of stations objects to put into getIso after
 */
exports.originToArrOfStations = async (center, minutes) => {
  const [lon, lat] = center;
  const start = {
    longitude: lon,
    latitude: lat,
    walk_minutes: minutes,
    // TODO v1.1 colorcoding by subway/walk/cycling: there are more fields here
  };

  const USE_DIJKSTRA = true;

  if (USE_DIJKSTRA) {
    return getStationsWithDijkstra(center, minutes); // must be [LAT,LON] = center
  } else {
    const boundingBox = exports.getBoundingBox(center); // may go away, just to limit API calls
    rows = await exports.getStationRowsInBoundingBox(boundingBox);
    // console.log(212, rows); // [{ node_id: '128', lng: '-73.99105700', lat: '40.75037300' },...]
    // replace this with station objects from dijkstra (substruct cost)
    let stations = rows.map((row) => {
      return {
        longitude: parseFloat(row.lng),
        latitude: parseFloat(row.lat),
        walk_minutes: parseInt(minutes), // just a test. todo: replace calc minutes estimateMinutesFromLatLon(lng,lat,parseFloat(row.lng),parseFloat(row.lat))
      };
    });

    stations.push(start);
    // console.log(177, stations); //  [{ longitude: -73.991057, latitude: 40.750373, walk_minutes: 16 }, ...]
    return stations;
  }
};
