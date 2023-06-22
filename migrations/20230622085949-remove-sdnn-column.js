"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("user_vitals", "sdnn");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("user_vitals", "sdnn", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
