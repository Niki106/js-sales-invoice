'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'accessorytoorders',
      'orderId',
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
      'accessorytoorders', 
      'stockId', 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'accessorystocks', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'accessorytoorders',
      'orderId'
    );
    await queryInterface.removeColumn(
      'accessorytoorders',
      'stockId'
    );
  }
};
