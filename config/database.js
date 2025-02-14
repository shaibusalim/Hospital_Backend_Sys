require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
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