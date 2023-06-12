"use strict";

const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const User = require("./user");
module.exports = (sequelize, DataTypes) => {
  class Volunteer extends Model {
    static associate(models) {
      Volunteer.hasMany(models.User, {
        foreignKey: "volunteer_id",
        as: "users", // Add this line to specify the alias for the association
      });
    }
  }

  Volunteer.init(
    {
      volunteer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "others"),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Volunteer",
      tableName: "volunteers",
    }
  );

  return Volunteer;
};
