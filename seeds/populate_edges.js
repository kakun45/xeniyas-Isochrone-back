exports.seed = async function (knex) {
  await knex("edges").del();
  await knex("edges").insert([
    { train_name: "7", travel_min: "24", node_a: 1, node_b: 2 },
  ]);
};
