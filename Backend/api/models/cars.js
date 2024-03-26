"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cars.hasMany(models.users, {
        foreignKey: {
          name: "name",
        },
      });
    }
  }
  Cars.init(
    {
      name: DataTypes.TEXT,
      estado: DataTypes.TEXT,
      cidade: DataTypes.TEXT,
      cpf: DataTypes.TEXT,
      email: DataTypes.TEXT,
      telefone: DataTypes.TEXT,

    },
    {
      sequelize,
      modelName: "cars",
    }
  );
  return Cars;
};
