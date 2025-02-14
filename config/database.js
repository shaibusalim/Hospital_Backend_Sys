require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config.json');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

/*const sequelize = new Sequelize(process.env.DB_USER, process.env.DB_NAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  });

  */

  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  });




sequelize
.authenticate()
.then(() => {
    console.log('Database connection established');
})
.catch(err => {
    console.error('Database connection failed:', err.message);
})

module.exports = sequelize;