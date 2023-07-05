"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "height");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "height", {
      type: Sequelize.FLOAT,
    });
  },
};
