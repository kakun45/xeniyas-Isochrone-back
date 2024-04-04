const mysql2 = require("mysql2");
require("dotenv").config();

// Create a connection to the database
const connection = mysql2.createConnection(process.env.DB_CONNECTION_URL);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.log("Error connecting to database: ", err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Close the connection
connection.end();
