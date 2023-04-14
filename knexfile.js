require("dotenv").config();

module.exports = {
  devep: {
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
      ssl: { rejectUnauthorized: process.env.ssl },
      charset: "utf8",
    },
  },
};

// phase 2 todo: for deployment
// module.exports = {

// };
