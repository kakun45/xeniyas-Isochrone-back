require("dotenv").config();
const fs = require("fs");
// const data = fs.readFileSync("ca.pem", "utf-8");
// console.log(data);

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.host,
      user: process.env.username,
      password: process.env.password,
      database: process.env.database,
      charset: "utf8",
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
            ca: Buffer.from(process.env.DATABASE_CA, "base64").toString(
              "utf-8"
            ),
          }
        : { rejectUnauthorized: false },
      // ca: fs.readFileSync("ca.pem"), // uncoment when local. Provide the actual file path to certif.when connected local-to-online db, todo: fix for Vercel
      // rejectUnauthorized: false }, // quick fix: Allows self-signed certificates for online db
    },
    charset: "utf8",
  },
};

// console.log(process.env); // to see if .env is loaded
// console.log("35) cert:", fs.readFileSync("ca.pem"));
//  to create tables:
// npm run migrate
//  to populate:
// npm run seed
