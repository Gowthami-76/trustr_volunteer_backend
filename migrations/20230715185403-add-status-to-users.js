"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "status", {
      type: Sequelize.ENUM("registered", "vitals completed"),
      defaultValue: "registered",
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "status");
  },
};
