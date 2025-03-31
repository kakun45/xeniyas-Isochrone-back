/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
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

      // table.unique(["node_a", "node_b"]); // cannot use it for aivan free db, as soon sql_require_primary_key is ON.

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

      // Add a composite primary key (aivan database has the system variable sql_require_primary_key enabled. This means every table must have a primary key, but my edges table does not.)
      table.primary(["node_a", "node_b"]);
    })
    .then(function () {
      console.log("Table created successfully!");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } The code, dropTable runs asynchronously, so chaining them directly can cause issues. Instead, using dropTable inside a .then() to ensure the second table drops only after the first one.
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("edges")
    .then(() => knex.schema.dropTableIfExists("nodes"));
};

// SQL
// CREATE TABLE nodes (
//   node_id VARCHAR(255) PRIMARY KEY,
//   station_name VARCHAR(255) NOT NULL,
//   lng DECIMAL(11, 8) NOT NULL,
//   lat DECIMAL(10, 8) NOT NULL
// );
// Completed in 73 ms
// ❯
// CREATE TABLE edges (
//   node_a VARCHAR(255) NOT NULL,
//   node_b VARCHAR(255) NOT NULL,
//   avg_travel_sec INT,
//   UNIQUE KEY (node_a, node_b)
// );
// Completed in 56 ms
