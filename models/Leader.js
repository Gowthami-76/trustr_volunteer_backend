"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Leader extends Model {
    static associate(models) {
      Leader.belongsTo(models.Location, { foreignKey: "locationId" });
    }
  }
  Leader.init(
    {
      leader_id: {
        // Change 'id' to 'leader_id'
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      leader_name: {
        // Change 'name' to 'leader_name'
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Leader",
      tableName: "leaders",
    }
  );
  return Leader;
};
