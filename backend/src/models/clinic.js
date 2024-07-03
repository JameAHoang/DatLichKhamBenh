"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.hasOne(models.Markdown, { foreignKey: "clinicId" });
      Clinic.hasOne(models.Doctor_Infor, { foreignKey: "clinicId" });
    }
  }
  Clinic.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.BLOB,
    },
    {
      sequelize,
      modelName: "Clinic",
    }
  );
  return Clinic;
};
