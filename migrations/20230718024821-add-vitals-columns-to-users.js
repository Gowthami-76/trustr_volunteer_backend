"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns to the users table
    await queryInterface.addColumn("users", "vitals_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "vitals_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add foreign key constraints
    await queryInterface.addConstraint("users", {
      fields: ["vitals_by"],
      type: "foreign key",
      name: "users_vitals_by_foreign_key",
      references: {
        table: "user_vitals",
        field: "volunteer_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addConstraint("users", {
      fields: ["vitals_at"],
      type: "foreign key",
      name: "users_vitals_at_foreign_key",
      references: {
        table: "user_vitals",
        field: "datetime",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign key constraints
    await queryInterface.removeConstraint("users", "users_vitals_by_foreign_key");
    await queryInterface.removeConstraint("users", "users_vitals_at_foreign_key");

    // Remove the added columns from the users table
    await queryInterface.removeColumn("users", "vitals_by");
    await queryInterface.removeColumn("users", "vitals_at");
  },
};
