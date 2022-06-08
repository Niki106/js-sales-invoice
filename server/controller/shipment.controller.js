const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");

const chairStockController = require("./chairStock.controller");
const deskStockController = require("./deskStock.controller");
const accessoryStockController = require("./accessoryStock.controller");
const db = require("../models");

module.exports = {
  getProducts,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getProducts(req, res, next) {
  try {
    const chairProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, SUM(l.qty) AS orderedQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.model, GROUP_CONCAT(l.id SEPARATOR ',') AS rids FROM chairtoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN chairstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL GROUP BY l.stockId",
      {
        type: QueryTypes.SELECT,
      }
    );
    const deskProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, SUM(l.qty) AS orderedQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.model, l.hasDeskTop, l.topMaterial, l.topColor, GROUP_CONCAT(l.id SEPARATOR ',') AS rids FROM desktoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN deskstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL AND l.hasDeskTop=0 GROUP BY l.stockId UNION SELECT l.qty AS totalQty, l.qty AS orderedQty, r1.`name` AS clients, l.orderId, l.stockId, r2.model, l.hasDeskTop, l.topMaterial, l.topColor, l.id AS rids FROM desktoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN deskstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL AND l.hasDeskTop=1",
      {
        type: QueryTypes.SELECT,
      }
    );
    const accessoryProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, SUM(l.qty) AS orderedQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.`name`, GROUP_CONCAT(l.id SEPARATOR ',') AS rids FROM accessorytoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN accessorystocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL GROUP BY l.stockId",
      {
        type: QueryTypes.SELECT,
      }
    );

    const products = {
      chairs: chairProducts,
      desks: deskProducts,
      accessories: accessoryProducts,
    };
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getAllOld(where) {
  return await db.Shipment.findAll({
    where,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.ChairStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.DeskToShipment,
      },
      {
        model: db.DeskStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
    ],
  });
}

async function getAll(where) {
  return await db.Shipment.findAll();
}

async function getById(id) {
  return await getSalesOrder(id);
}

async function create(req, res, next) {
  try {
    const { chairs, desks, accessories, ...restParams } = req.body;

    const id = (await db.Shipment.create({ ...restParams })).id;

    for (let chair of chairs) {
      await db.ChairToShipment.create({
        client: chair.clients,
        qty: chair.totalQty,
        orderedQty: chair.orderedQty,
        shipmentId: id,
        stockId: chair.stockId,
      });

      const refer_ids = chair.rids.split(",");
      // updating the chairToOrder with shipmentId
      for (let refer_id of refer_ids) {
        const chairToOrder = await db.ChairToOrder.findOne({
          where: { id: refer_id },
        });
        Object.assign(chairToOrder, { shipmentId: id });
        await chairToOrder.save();
      }

      // if arrival date is set when creating the shipment, upgrade the balance of stock
      const arrivalDate = restParams.arrivalDate;
      if (arrivalDate !== "") {
        const shipmentBalance =
          parseInt(chair.totalQty) - parseInt(chair.orderedQty);
        const stock = await db.ChairStock.findOne({
          where: { id: chair.stockId },
        });
        Object.assign(stock, { balance: shipmentBalance });
        await stock.save();
      }
    }

    for (let desk of desks) {
      await db.DeskToShipment.create({
        client: desk.clients,
        qty: desk.totalQty,
        orderedQty: desk.orderedQty,
        hasDeskTop: desk.hasDeskTop,
        topColor: desk.topColor,
        topMaterial: desk.topMaterial,
        shipmentId: id,
        stockId: desk.stockId,
      });

      const refer_ids = desk.rids.split(",");
      // updating the chairToOrder with shipmentId
      for (let refer_id of refer_ids) {
        const deskToOrder = await db.DeskToOrder.findOne({
          where: { id: refer_id },
        });
        Object.assign(deskToOrder, { shipmentId: id });
        await deskToOrder.save();
      }

      // if arrival date is set when creating the shipment, upgrade the balance of stock
      const arrivalDate = restParams.arrivalDate;
      if (arrivalDate !== "" && !desk.hasDeskTop) {
        const shipmentBalance =
          parseInt(desk.totalQty) - parseInt(desk.orderedQty);
        const stock = await db.DeskStock.findOne({
          where: { id: desk.stockId },
        });
        Object.assign(stock, { balance: shipmentBalance });
        await stock.save();
      }
    }

    for (let accessory of accessories) {
      await db.AccessoryToShipment.create({
        client: accessory.clients,
        qty: accessory.totalQty,
        orderedQty: accessory.orderedQty,
        shipmentId: id,
        stockId: accessory.stockId,
      });

      const refer_ids = accessory.rids.split(",");
      // updating the chairToOrder with shipmentId
      for (let refer_id of refer_ids) {
        const accessoryToOrder = await db.AccessoryToOrder.findOne({
          where: { id: refer_id },
        });
        Object.assign(accessoryToOrder, { shipmentId: id });
        await accessoryToOrder.save();
      }

      // if arrival date is set when creating the shipment, upgrade the balance of stock
      const arrivalDate = restParams.arrivalDate;
      if (arrivalDate !== "") {
        const shipmentBalance =
          parseInt(accessory.totalQty) - parseInt(accessory.orderedQty);
        const stock = await db.AccessoryStock.findOne({
          where: { id: accessory.stockId },
        });
        Object.assign(stock, { balance: shipmentBalance });
        await stock.save();
      }
    }
    res.json({ message: "New Shipment was created successfully." });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const shipment = await getShipment(id);
    const { ...restParams } = req.body;
    Object.assign(shipment, restParams);
    await shipment.save();

    const arrivalDate = restParams.arrivalDate;
    if (arrivalDate !== "") {
      const chairToShipments = await db.ChairToShipment.findAll({
        where: { shipmentId: id },
      });
      for (let shipment of chairToShipments) {
        const shipmentBalance =
          parseInt(shipment.qty) - parseInt(shipment.orderedQty);
        const stock = await db.ChairStock.findOne({
          where: { id: shipment.stockId },
        });
        Object.assign(stock, { balance: shipmentBalance });
        await stock.save();
      }

      const deskToShipments = await db.DeskToShipment.findAll({
        where: { shipmentId: id, hasDeskTop: 0 },
      });
      for (let shipment of deskToShipments) {
        const shipmentBalance =
          parseInt(shipment.qty) - parseInt(shipment.orderedQty);
        const stock = await db.DeskStock.findOne({
          where: { id: shipment.stockId },
        });
        Object.assign(stock, { balance: shipmentBalance });
        await stock.save();
      }

      const accessoryToShipments = await db.AccessoryToShipment.findAll({
        where: { shipmentId: id },
      });
      for (let shipment of accessoryToShipments) {
        const shipmentBalance =
          parseInt(shipment.qty) - parseInt(shipment.orderedQty);
        const stock = await db.AccessoryStock.findOne({
          where: { id: shipment.stockId },
        });
        Object.assign(stock, { balance: shipmentBalance });
        await stock.save();
      }
    }
    res.json({ message: "Shipment was updated successfully." });
  } catch (err) {
    next(err);
  }
}

async function _delete(id) {
  const shipment = await getShipment(id);
  await shipment.destroy();
}

//helper function

async function getShipment(id) {
  const shipment = await db.Shipment.findOne({
    where: { id },
    include: [
      {
        model: db.ChairStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.DeskToOrder,
      },
      {
        model: db.DeskStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      {
        model: db.AccessoryStock,
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
    ],
  });

  if (!shipment) throw "Shipment was not found.";

  return shipment;
}
