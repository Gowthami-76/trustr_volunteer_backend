"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_vitals", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      hr: { type: Sequelize.STRING },
      spo2: { type: Sequelize.STRING },
      br: { type: Sequelize.STRING },
      sdnn: { type: Sequelize.STRING },
      sl: { type: Sequelize.STRING },
      bp: { type: Sequelize.STRING },
      datetime: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_vitals");
  },
};
