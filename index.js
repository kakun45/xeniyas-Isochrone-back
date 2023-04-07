// BACKEND! REST API
const express = require("express");
const axios = require("axios");
// Create Express app and also allow for app PORT to be optionally specified by an environment variable
const app = express();
// cors package prevents CORS errors when using client side API calls
const cors = require("cors");
// Require .env files for environment variables (keys and secrets)
require("dotenv").config();
const routeDestinations = require("./routes/destinations");

const port = process.env.PORT || 8080;

// Enable req.body middleware
app.use(express.json());

app.use(cors());

// routs
app.use("/api/v1/destinations", routeDestinations);

app.listen(process.env.PORT || 8080, () => {
  console.log(`🚀Fire the command! Port: ${port}`);
});
