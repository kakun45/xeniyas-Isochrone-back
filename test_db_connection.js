const mysql2 = require("mysql2");
require("dotenv").config();

// This ensures that the database connection status is communicated back to the client efficiently and that the connection attempt's outcome is handled appropriately:
// After attempting to connect to the database, the callback will be called with either an error or a success message. The provided callback function handles the response to the Client based on result
const checkDbConnection = () => {
  return new Promise((resolve, reject) => {
    // console.log("DATABASE_URL:", process.env.DATABASE_URL); // test line to log the DB connection UR
    const connection = mysql2.createConnection(process.env.DATABASE_URL);

    connection.connect((err) => {
      if (err) {
        // connection.end(); // alternative close connection goes here
        console.error("Error connecting to database:", err.stack);
        reject({
          message: "Database connection failed. Please try again later.",
          type: "error",
        });
      } else {
        console.log("Connected to database.");
        resolve({ message: "db test: ok", type: "success" });
        // connection.end(); // and here
      }
      // Close the connection ONLY once the promise resolves or rejects
      connection.on("error", () => connection.end());
      connection.on("end", () => connection.end());
    });
  });
};
module.exports = checkDbConnection;
