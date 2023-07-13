"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.hasOne(models.Leader, { foreignKey: "locationId" });
    }
  }
  Location.init(
    {
      location_id: {
        // Change 'id' to 'location_id'
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      location_name: {
        // Change 'name' to 'location_name'
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Location",
      tableName: "locations",
    }
  );
  return Location;
};
