"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    static associate(models) {
      this.hasMany(models.DeskToOrder, {
        foreignKey: "shipmentId",
      });
      this.belongsToMany(models.ChairStock, {
        through: "ChairToShipment",
        foreignKey: "shipmentId",
        otherKey: "stockId",
      });
      this.belongsToMany(models.DeskStock, {
        through: "DeskToShipment",
        foreignKey: "shipmentId",
        otherKey: "stockId",
      });
      this.belongsToMany(models.AccessoryStock, {
        through: "AccessoryToShipment",
        foreignKey: "shipmentId",
        otherKey: "stockId",
      });
    }
  }
  Shipment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      ponumber: DataTypes.STRING,
      orderDate: DataTypes.DATEONLY,
      arrivalDate: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Shipment",
      tableName: "shipments",
    }
  );
  return Shipment;
};
