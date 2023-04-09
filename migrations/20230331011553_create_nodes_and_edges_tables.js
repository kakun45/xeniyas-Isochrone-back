exports.up = function (knex) {
  return knex.schema
    .createTable("nodes", (table) => {
      table.string("node_id").primary();
      table.string("station_name").notNullable();
      // decimal data type with the desired precision and scale:
      table.decimal("lng", 11, 8).notNullable();
      table.decimal("lat", 10, 8).notNullable();
    })
    .createTable("edges", (table) => {
      table.string("node_a").notNullable();
      table.string("node_b").notNullable();
      table.integer("avg_travel_sec"); // todo: turn into min
      // table.string("train_name").notNullable(); // not needed for now, add later
      table.unique(["node_a", "node_b"]);
      // this is optimization for db: use of a foreign key; it works, tested, but I don't need them @ the moment:
      // table
      //   .foreign("node_a")
      //   .references("node_id")
      //   .inTable("nodes")
      //   .onUpdate("CASCADE")
      //   .onDelete("CASCADE");
      // table
      //   .foreign("node_b")
      //   .references("node_id")
      //   .inTable("nodes")
      //   .onUpdate("CASCADE")
      //   .onDelete("CASCADE");
    })
    .then(function () {
      console.log("Table created successfully!");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("edges").dropTable("nodes");
};
