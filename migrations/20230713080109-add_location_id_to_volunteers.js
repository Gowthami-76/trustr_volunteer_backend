"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("volunteers", "location_id", {
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
    await queryInterface.removeColumn("volunteers", "location_id");
  },
};
