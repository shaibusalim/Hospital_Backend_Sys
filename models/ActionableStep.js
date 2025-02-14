const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ActionableStep extends Model {}

ActionableStep.init({
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Notes',
      key: 'id',
    },
  },
  checklist: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  plan: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ActionableStep',
});

module.exports = ActionableStep;