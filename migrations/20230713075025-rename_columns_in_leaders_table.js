"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("leaders", "id", "leader_id");
    await queryInterface.renameColumn("leaders", "name", "leader_name");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("leaders", "leader_id", "id");
    await queryInterface.renameColumn("leaders", "leader_name", "name");
  },
};
