'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AccessoryToOrders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      orderId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      unitPrice: {
        allowNull: false,
        defaultValue: 1000,
        type: Sequelize.FLOAT,
      },
      qty: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      deliveryOption: {
        allowNull: false,
        defaultValue: 'Delivery Included',
        type: Sequelize.STRING,
      },
      preOrder: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      preDeliveryDate: {
        type: Sequelize.DATEONLY,
      },
      estDeliveryDate: {
        type: Sequelize.DATEONLY,
      },
      from: {
        type: Sequelize.TIME,
      },
      to: {
        type: Sequelize.TIME,
      },
      delivered: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      signURL: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AccessoryToOrders');
  },
};
