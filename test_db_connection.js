const mysql2 = require("mysql2");
require("dotenv").config();

const dbHost = process.env.DATABASE_HOST,
  dbUser = process.env.DATABASE_USER,
  dbName = process.env.DATABASE_NAME,
  dbPass = process.env.DATABASE_PASSWORD,
  dbPort = process.env.DATABASE_PORT;

// This ensures that the database connection status is communicated back to the client efficiently and that the connection attempt's outcome is handled appropriately:
// After attempting to connect to the database, the callback will be called with either an error or a success message. The provided callback function handles the response to the Client based on result
const checkDbConnection = () => {
  return new Promise((resolve, reject) => {
    // const connection = mysql2.createConnection(process.env.DATABASE_URL); // not working with special chars in pass
    const connection = mysql2.createConnection({
      host: dbHost,
      user: dbUser,
      database: dbName,
      password: dbPass,
      port: dbPort,
    });

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
        // connection.end(); // and alternative close connection goes here
      }
      // Close the connection ONLY once the promise resolves or rejects
      connection.on("error", () => connection.end());
      connection.on("end", () => connection.end());
    });
  });
};
module.exports = checkDbConnection;

// to run on CLI use: mysql -u db_user -p -h db_host -P db_port db_name
