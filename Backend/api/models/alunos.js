"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Alunos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Alunos.hasMany(models.users, {
        foreignKey: {
          name: "name",
        },
      });
    }
  }
  Alunos.init(
    {
      name: DataTypes.TEXT,
      genero: DataTypes.TEXT,
      responsavel: DataTypes.TEXT,
      telefone: DataTypes.TEXT,
      turma: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "alunos",
    }
  );
  return Alunos;
};
