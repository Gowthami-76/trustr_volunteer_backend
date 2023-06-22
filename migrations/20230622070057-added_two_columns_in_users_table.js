"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "address", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "zipcode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "address");
    await queryInterface.removeColumn("users", "zipcode");
  },
};
