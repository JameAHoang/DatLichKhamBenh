"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Patient, {
        foreignKey: "patientId",
        as: "patientDataHistory",
      });

      History.belongsTo(models.Allcode, {
        foreignKey: "timeType",
        targetKey: "keyMap",
        as: "timeTypeDataHistory",
      });

      History.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorDataHistory",
      });
    }
  }
  History.init(
    {
      patientId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      timeType: DataTypes.STRING,
      date: DataTypes.DATE,
      reason: DataTypes.STRING,
      visit: DataTypes.INTEGER,
      files: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};
