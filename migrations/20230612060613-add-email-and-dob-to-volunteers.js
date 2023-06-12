"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("volunteers", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("volunteers", "date_of_birth", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("volunteers", "email");
    await queryInterface.removeColumn("volunteers", "date_of_birth");
  },
};
