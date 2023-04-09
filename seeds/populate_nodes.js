/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { readNodes } = require("../controllers/other");

/**
 * takes json exported by pandas in a column format and
 * transforms to array of station objects
 * 496 rows in set (0.01 sec)
 */
function nodeColumnsToStations(nodesData) {
  const stations = [];
  const row_count = Object.keys(nodesData.station_id).length;
  for (let i = 0; i < row_count; i++) {
    const station_id = nodesData.station_id[i.toString()];
    const station_name = nodesData.station_name[i.toString()];
    const lat = nodesData.lat[i.toString()];
    const lng = nodesData.lon[i.toString()];
    let station = {
      node_id: station_id,
      lng: lng,
      lat: lat,
      station_name: station_name,
    };
    stations.push(station);
  }
  return stations;
}

exports.seed = async function (knex) {
  // 1. Load the JSON data from each data file
  const nodesData = readNodes();
  // Deletes ALL existing entries from table
  await knex("nodes").truncate();
  const stations = nodeColumnsToStations(nodesData); // arr
  // 496 rows in set (0.00 sec)
  await knex("nodes").insert(stations);
  // works, keep here for example:
  // await knex("nodes").insert([
  //   {
  //     node_id: 1,
  //     lng: -73.977237,
  //     lat: 40.752702,
  //     station_name: "Grand Central",
  //   },
  //   {
  //     node_id: 2,
  //     lng: -73.996201,
  //     lat: 40.725262,
  //     station_name: "Broadway-Lafayette street",
  //   },
  //   {
  //     node_id: 3,
  //     lng: -73.98,
  //     lat: 40.725262,
  //     station_name: "dummy",
  //   },
  // ]);
};
