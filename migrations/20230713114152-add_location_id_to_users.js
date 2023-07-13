"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "location_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "locations",
        key: "location_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "location_id");
  },
};
