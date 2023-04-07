exports.up = function (knex) {
  return knex.schema
    .createTable("nodes", (table) => {
      table.increments("node_id").unsigned().primary();
      table.string("station_name").notNullable();
      table.decimal("lng").notNullable();
      table.decimal("lat").notNullable();
    })
    .createTable("edges", (table) => {
      table.string("travel_min");
      table.integer("node_a").unsigned().notNullable();
      table.integer("node_b").unsigned().notNullable();
      table.string("train_name").notNullable();
      table.unique(["node_a", "node_b", "train_name"]);
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
