require("dotenv").config();

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
      host: process.env.host,
      user: process.env.username,
      password: process.env.password,
      database: process.env.database,
      // ssl: { rejectUnauthorized: process.env.ssl },
      // charset: "utf8",
    },
  },
};

// console.log(process.env); // to see if .env is loaded

//  to create tables:
// npm run migrate
//  to populate
// npm run seed
