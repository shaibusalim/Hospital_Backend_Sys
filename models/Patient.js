const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Patient extends Model {}

Patient.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Doctors',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Patient',
});

module.exports = Patient;