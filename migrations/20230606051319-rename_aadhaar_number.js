"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("users", "aadhar_number", "aadhaar_number");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("users", "aadhaar_number", "aadhar_number");
  },
};
