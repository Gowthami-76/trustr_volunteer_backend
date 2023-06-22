"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("user_vitals", "volunteer_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "volunteers",
        key: "volunteer_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("user_vitals", "volunteer_id");
  },
};
