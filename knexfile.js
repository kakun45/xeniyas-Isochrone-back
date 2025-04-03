require("dotenv").config();
const fs = require("fs");
// const data = fs.readFileSync("ca.pem", "utf-8");
// console.log(data);
// CLI: ```cat ca.pem | base64```

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      // 25/3/31 works: from local server to local db
      // host: process.env.host,
      // user: process.env.username,
      // password: process.env.password,
      // database: process.env.database,

      // 25/4/2 works: from local server to online db
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,

      // works, activate it
      // ssl: {
      //   ca: fs.readFileSync("ca.pem", "utf-8"), // Works locally when provided the actual file path to certif. When connected local-to-online db
      // },

      // testing. works locally
      ssl: process.env.DATABASE_CA
        ? {
            // Directly passing the decoded base64 as a Buffer
            ca: Buffer.from(process.env.DATABASE_CA, "base64"),
          }
        : { rejectUnauthorized: false },
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
      ssl: process.env.DATABASE_CA
        ? {
            // Directly passing the decoded base64 as a Buffer
            ca: Buffer.from(process.env.DATABASE_CA, "base64"),
          }
        : { rejectUnauthorized: false },
      // ssl: { rejectUnauthorized: false }, // Try without the CA
    },
    charset: "utf8",
  },
};

console.log(39, "LOG: knexfile.js:", process.env.DATABASE_CA); // to see if .env is loaded
// console.log("35) cert:", fs.readFileSync("ca.pem"));

//  to create tables:
// ```npm run migrate````
//  to populate:
// ```npm run seed```
