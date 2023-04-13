require("dotenv").config();

module.exports = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8",
  },
};

// phase 2 todo: for deployment
// module.exports = {
//   client: "mysql2",
//   connection: {
//     host: process.env.DATABASE_URL,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: "isocrones",
//     charset: "utf8",
//   },
// };
