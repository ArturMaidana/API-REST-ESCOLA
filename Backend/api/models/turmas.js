"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Turmas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Turmas.hasMany(models.users, {
        foreignKey: {
          name: "name",
        },
      });
    }
  }
  Turmas.init(
    {
      name: DataTypes.TEXT,
      ensino: DataTypes.TEXT,
      turno: DataTypes.TEXT,
      coordenador: DataTypes.TEXT,
      escola: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "turmas",
    }
  );
  return Turmas;
};
