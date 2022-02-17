'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChairToOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChairToOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      unitPrice: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
      deliveryOption: DataTypes.STRING,
      preOrder: DataTypes.BOOLEAN,
      preDeliveryDate: DataTypes.DATEONLY,
      estDeliveryDate: DataTypes.DATEONLY,
      from: DataTypes.TIME,
      to: DataTypes.TIME,
      delivered: DataTypes.BOOLEAN,
      poNum: DataTypes.STRING,
      signURL: DataTypes.STRING,
      remark: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'ChairToOrder',
      tableName: 'chairtoorders',
    }
  );
  return ChairToOrder;
};
