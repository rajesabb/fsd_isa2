'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Prescription extends Model {

    static associate(models) {

      Prescription.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient'
      });

      Prescription.hasMany(models.RefillAlert, {
        foreignKey: 'prescriptionId',
        as: 'refillAlerts'
      });

    }

  }

  Prescription.init({

    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Patient ID must be an integer'
        }
      }
    },

    medicineName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Medicine name is required'
        }
      }
    },

    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Dosage is required'
        }
      }
    },

    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Frequency is required'
        }
      }
    },

    refillDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: {
          args: [['active', 'completed', 'cancelled']],
          msg: 'Status must be active, completed, or cancelled'
        }
      }
    }

  }, {
    sequelize,
    modelName: 'Prescription',
    tableName: 'prescriptions'
  });

  return Prescription;
};