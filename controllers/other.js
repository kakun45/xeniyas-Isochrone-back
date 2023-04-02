const fs = require("fs");

const readData = () => {
  // WARNING! only one "dot/<path>" routs on data, bc we call it from index.js, not from here
  // console.log(JSON.parse(fs.readFileSync("./data/one_call_geometries.json")));
  return JSON.parse(fs.readFileSync("./data/one_call_geometries.json"));
};

module.exports = { readData };
