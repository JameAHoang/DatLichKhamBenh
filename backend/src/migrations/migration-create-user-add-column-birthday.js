"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      await queryInterface.addColumn("Users", "birthday", Sequelize.DATE),
    ];
  },

  async down(queryInterface, Sequelize) {
    // logic for reverting the changes
  },
};
