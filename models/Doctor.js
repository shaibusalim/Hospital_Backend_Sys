const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Doctor extends Model {}

Doctor.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Doctor',
});

module.exports = Doctor;