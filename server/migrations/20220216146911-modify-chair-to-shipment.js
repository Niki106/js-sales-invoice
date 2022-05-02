'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'chairtoshipments',
      'stockId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'chairstocks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'chairtoshipments',
      'stockId'
    );
  }
};
