'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Patient extends Model {

    static associate(models) {

      Patient.hasMany(models.Prescription, {
        foreignKey: 'patientId',
        as: 'prescriptions'
      });

    }

  }

  Patient.init({

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Patient name is required'
        }
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email'
        }
      }
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Phone number is required'
        }
      }
    }

  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients'
  });

  return Patient;
};