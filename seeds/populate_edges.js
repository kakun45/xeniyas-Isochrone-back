const { readEdges } = require("../controllers/other");
/**
 * takes json exported by pandas in a column format and
 * transforms to array of station objects: 573 edges
 */
function edgeColumnsToWeights(edgesData) {
  const edges = [];
  const row_count = Object.keys(edgesData.node_left).length;
  for (let i = 0; i < row_count; i++) {
    const node_left = edgesData.node_left[i.toString()];
    const node_right = edgesData.node_right[i.toString()];
    const avg_travel_sec = edgesData.mean[i.toString()];
    let edge = {
      node_a: node_left,
      node_b: node_right,
      avg_travel_sec: avg_travel_sec,
    };
    edges.push(edge);
  }
  return edges;
}

exports.seed = async function (knex) {
  const edgesData = readEdges();
  const edges = edgeColumnsToWeights(edgesData);
  await knex("edges").truncate();
  await knex("edges").insert(edges);
};
