"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "aadhaar_front", {
      type: Sequelize.TEXT,
      allowNull: true,
      len: 1000,
    });
    await queryInterface.addColumn("users", "aadhaar_back", {
      type: Sequelize.TEXT,
      allowNull: true,
      len: 1000,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "aadhaar_front");
    await queryInterface.removeColumn("users", "aadhaar_back");
  },
};
