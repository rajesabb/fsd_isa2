'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class RefillAlert extends Model {

    static associate(models) {

      RefillAlert.belongsTo(models.Prescription, {
        foreignKey: 'prescriptionId',
        as: 'prescription'
      });

    }

  }

  RefillAlert.init({

    prescriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Prescription ID must be an integer'
        }
      }
    },

    alertDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'sent', 'completed']],
          msg: 'Status must be pending, sent, or completed'
        }
      }
    },

    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Alert message is required'
        }
      }
    }

  }, {
    sequelize,
    modelName: 'RefillAlert',
    tableName: 'refill_alerts'
  });

  return RefillAlert;

};