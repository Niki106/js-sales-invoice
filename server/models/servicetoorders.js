'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      this.belongsTo(models.SalesOrder, {
        foreignKey: 'orderId'
      });
    }
  }
  Service.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      description: DataTypes.STRING,
      price: DataTypes.FLOAT
    },
    {
      sequelize,
      modelName: 'ServiceToOrder',
      tableName: 'servicetoorders',
    }
  );
  return Service;
};
