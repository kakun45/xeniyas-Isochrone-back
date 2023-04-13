require("dotenv").config();

// module.exports = {
//   client: "mysql2",
//   connection: {
//     host: "127.0.0.1",
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     charset: "utf8",
//   },
// };

// phase 2 todo: for deployment
module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.host,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database,
    // ssl: { rejectUnauthorized: process.env.ssl },
    charset: "utf8",
  },
};
