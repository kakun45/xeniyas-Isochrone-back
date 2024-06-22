// BACKEND! REST API
const express = require("express");
const axios = require("axios");

// const environment = process.env.ENVIRONMENT || "development";
const environment = process.env.ENVIRONMENT || "production";
const knex = require("knex")(require("./knexfile")[environment]);

const checkDbConnection = require("./test_db_connection");
// cors package prevents CORS errors when using client side API calls
const cors = require("cors");
// Require .env files for environment variables (keys and secrets)
require("dotenv").config(); // (keys and secrets)

// Create Express app and also allow for app PORT to be optionally specified by an environment variable
const app = express();
const port = process.env.PORT || 8080;

// configure CORS: This tells a backend which origins (frontend URLs) are allowed to access its resources
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || origin === process.env.FRONTEND_URL) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Allows cookies if needed
//   optionsSuccessStatus: 204, // Some legacy browsers choke on 204
// };
// Enable CORS to prevent CORS errors when using client-server API calls
app.use(cors());
// app.use(cors(corsOptions)); // enable CORS with options

// Enable req.body middleware: used to enable JSON parsing on the incoming request.
// By default, express.json() middleware limits the request payload size to 100kb
app.use(express.json());

const routeDestinations = require("./routes/destinations");

// ROUTS
// 1. Test DB Endpoint to check the database connection status
// In the callback function, sending an appropriate response based on the connection status.
app.get("/api/check-db", async (req, res) => {
  try {
    const result = await checkDbConnection();
    res.json(result);
  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json(error);
  }
});

// 2. Mounts the routes defined in routes/Destinations.js to the /api path.
app.use("/api/v1/destinations", routeDestinations);

//  3. Status check testing tool endpoint
app.use("/api/debug", async (req, res) => {
  try {
    const edges = await knex("edges");
    if (edges) {
      res.status(200).json({ msg: "Db is OK." });
    } else {
      res.status(404).json("Not found");
    }
  } catch (error) {
    console.error(process.env.DATABASE_HOST);
    console.error("Host: ", process.env.host);
    console.error("500 Error: ", error);
    res.status(500).send(error);
  }
});
//  Start the server
app.listen(port, () => {
  console.log(`🚀Fire the command! Port: ${port}`);
});

//  to run: npx nodemon index.js
