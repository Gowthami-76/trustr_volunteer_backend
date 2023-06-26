"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Volunteer, {
        foreignKey: "volunteer_id",
      });
      User.hasMany(models.UserVital, { foreignKey: "user_id" });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      volunteer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      aadhaar_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      gender: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["male", "female", "others"],
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipcode: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      enrollment_status: {
        type: DataTypes.ENUM("active", "pending"),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at", // Use the actual column name in the database
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at", // Use the actual column name in the database
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false, // Add this line to disable Sequelize timestamps
    }
  );

  return User;
};
