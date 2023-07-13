"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("locations", "id", "location_id");
    await queryInterface.renameColumn("locations", "name", "location_name");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("locations", "location_id", "id");
    await queryInterface.renameColumn("locations", "location_name", "name");
  },
};
