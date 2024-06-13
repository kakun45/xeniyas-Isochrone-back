// BACKEND! REST API
const express = require("express");
const axios = require("axios");
const checkDbConnection = require("./test_db_connection");
// cors package prevents CORS errors when using client side API calls
const cors = require("cors");
// Require .env files for environment variables (keys and secrets)
require("dotenv").config(); // (keys and secrets)

// Create Express app and also allow for app PORT to be optionally specified by an environment variable
const app = express();
const port = process.env.PORT || 8080;
// Enable CORS to prevent CORS errors when using client-side API calls
app.use(cors());
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

//  Start the server
app.listen(process.env.PORT || 8080, () => {
  console.log(`🚀Fire the command! Port: ${port}`);
});

//  to run: npx nodemon index.js
