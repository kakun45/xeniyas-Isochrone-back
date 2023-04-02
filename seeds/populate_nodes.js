/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries from both tables
  await knex("nodes").del();
  await knex("nodes").insert([
    {
      node_id: 1,
      lng: -73.977237,
      lat: 40.752702,
      station_name: "Grand Central",
    },
    {
      node_id: 2,
      lng: -73.996201,
      lat: 40.725262,
      station_name: "Broadway-Lafayette street",
    },
    {
      node_id: 3,
      lng: -73.98,
      lat: 40.725262,
      station_name: "dummy",
    },
  ]);
};
