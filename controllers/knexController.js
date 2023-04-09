const knex = require("knex")(require("../knexfile"));

// exports.index = (req, res) => {}

// return the rows from the database, works:
// SELECT * FROM nodes
// WHERE lat BETWEEN (40.748424-0.007) AND (40.748424+0.007)
// AND lng BETWEEN (-73.985664-0.007) AND (-73.985664+0.007);

// never tested:
exports.selectDBStations = (req, res) => {
  // give it a bounding box
  knex("nodes")
    .select("node_id", "lng", "lat")
    .whereBetween("lng", [req.params.minLon, req.params.maxLon])
    .whereBetween("lat", [req.params.minLat, req.params.maxLat])
    .then((rows) => {
      if (!rows.length) {
        return res
          .status(404)
          .send(
            `minLon: ${req.params.minLon}, minLat: ${req.params.minLat} or maxLat/Lon were not found`
          );
      }
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
};

exports.getBoundingBox = (center) => {
  const size = 0.006; // roughly a mile in degrees: 0.014
  const [lon, lat] = center;
  const minLon = lon - size;
  const minLat = lat - size;
  const maxLon = lon + size;
  const maxLat = lat + size;
  return [minLon, minLat, maxLon, maxLat];
};

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

  const boundingBox = exports.getBoundingBox(center); // may go away, just to limit API calls
  rows = await exports.getStationRowsInBoundingBox(boundingBox);
  // TODO run dijkstra here

  // function rowToStation(row) {
  //   return {
  //     longitude: parseFloat(row.lng),
  //     latitude: parseFloat(row.lat),
  //     walk_minutes: parseInt(minutes),
  //   };
  // }

  // this is JS obj that getAllGeometry needs [{...}, {...}]
  let stations = rows.map((row) => {
    return {
      longitude: parseFloat(row.lng),
      latitude: parseFloat(row.lat),
      walk_minutes: parseInt(minutes),
    };
  });

  // console.log(stations.length);
  stations.push(start);
  // console.log(stations.length);

  return stations;
};
