"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialty.hasOne(models.Markdown, { foreignKey: "specialtyId" });
      Specialty.hasOne(models.Doctor_Infor, { foreignKey: "specialtyId" });
    }
  }
  Specialty.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      image: DataTypes.BLOB,
    },
    {
      sequelize,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
