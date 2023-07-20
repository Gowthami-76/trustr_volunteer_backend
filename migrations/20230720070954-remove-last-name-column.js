"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'last_name' column from the 'users' table
    await queryInterface.removeColumn("users", "last_name");
  },

  down: async (queryInterface, Sequelize) => {
    // Add the 'last_name' column back to the 'users' table
    await queryInterface.addColumn("users", "last_name", {
      type: Sequelize.STRING,
    });
  },
};
