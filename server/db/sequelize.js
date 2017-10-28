const Sequelize = require('sequelize');

console.log(`Attempting to connect to MYSQL: MYSQL_HOST = ${process.env.MYSQL_HOST}, MYSQL_DB:${process.env.MYSQL_DB}, MYSQL_USERNAME:${process.env.MYSQL_USERNAME}, MYSQL_PASSWORD:${process.env.MYSQL_PASSWORD}`);
const mysqlConnector = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql'
});

module.exports = mysqlConnector