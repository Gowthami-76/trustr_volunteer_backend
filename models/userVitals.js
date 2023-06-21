"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserVital extends Model {
    static associate(models) {
      UserVital.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }

  UserVital.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      hr: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      spo2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      br: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sdnn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },

    {
      sequelize,
      modelName: "UserVital",
      tableName: "user_vitals",
      freezeTableName: true,
      underscored: true,
      timestamps: false,
      classMethods: {
        associate: function (models) {
          UserVital.belongsTo(models.users, {
            as: "patient_id",
            foreignKey: "user_id",
          });
        },
      },
    }
  );

  return UserVital;
};
