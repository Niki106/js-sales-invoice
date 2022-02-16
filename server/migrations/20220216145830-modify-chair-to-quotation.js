'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'chairtoquotations',
      'quotationId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'salesorders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
    await queryInterface.addColumn(
      'chairtoquotations', 
      'stockId', 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'chairstocks', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'chairtoquotations',
      'quotationId'
    );
    await queryInterface.removeColumn(
      'chairtoquotations',
      'stockId'
    );
  }
};
