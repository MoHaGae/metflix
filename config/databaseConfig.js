/**
 * module import
 */
const mysql = require("mysql2");
const env = require("dotenv");
const log = require("../util/logger");

env.config();

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

/**
 * DB 설정
 */
const connection = mysql.createConnection(dbConfig);
connection.connect(() => {
  log.info("✅ DB Connected");
});

module.exports = connection.promise();
