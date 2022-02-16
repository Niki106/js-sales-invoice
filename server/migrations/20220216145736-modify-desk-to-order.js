'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'desktoorders',
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
      'desktoorders', 
      'stockId', 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'deskstocks', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'desktoorders',
      'orderId'
    );
    await queryInterface.removeColumn(
      'desktoorders',
      'stockId'
    );
  }
};
