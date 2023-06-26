"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("volunteers", "token", {
      type: Sequelize.STRING, // Adjust the data type if necessary
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("volunteers", "token");
  },
};
