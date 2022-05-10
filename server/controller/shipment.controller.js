const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");

const chairStockController = require("./chairStock.controller");
const deskStockController = require("./deskStock.controller");
const accessoryStockController = require("./accessoryStock.controller");
const { drawDeskTop } = require("server/middleware/deskDrawing");

module.exports = {
  getProducts,
  getAll,
  getById,
  create,
  update,
  updateWithoutStock,
  updateProducts,
  signDelivery,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function getProducts(req, res, next) {
  try {
    const chairProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.model FROM chairtoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN chairstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL GROUP BY l.stockId",
      {
        type: QueryTypes.SELECT,
      }
    );
    const deskProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.model, l.hasDeskTop, l.topMaterial, l.topColor FROM desktoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN deskstocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL GROUP BY l.stockId, l.hasDeskTop",
      {
        type: QueryTypes.SELECT,
      }
    );
    const accessoryProducts = await db.sequelize.query(
      "SELECT SUM(l.qty) AS totalQty, GROUP_CONCAT(r1.`name` SEPARATOR ',') AS clients, l.orderId, l.stockId, r2.`name` FROM accessorytoorders AS l LEFT JOIN salesorders AS r1 ON l.orderId=r1.id LEFT JOIN accessorystocks AS r2 ON l.stockId=r2.id WHERE l.preOrder=1 AND l.shipmentId IS NULL GROUP BY l.stockId",
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

async function getAll(where) {
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
        shipmentId: id,
        stockId: chair.stockId,
      });
    }

    for (let desk of desks) {
      await db.DeskToShipment.create({
        client: desk.clients,
        qty: desk.totalQty,
        hasDeskTop: desk.hasDeskTop,
        topColor: desk.topColor,
        topMaterial: desk.topMaterial,
        shipmentId: id,
        stockId: desk.stockId,
      });
    }

    for (let accessory of accessories) {
      await db.AccessoryToShipment.create({
        client: accessory.clients,
        qty: accessory.totalQty,
        shipmentId: id,
        stockId: accessory.stockId,
      });
    }
    res.json({ message: "New Shipment was created successfully." });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const host = req.get("host");
    const protocol = req.protocol;
    const id = req.params.id;
    const salesOrder = await getSalesOrder(id);
    const orderInvoiceNum = salesOrder.invoiceNum;
    const { ChairStocks, DeskStocks, AccessoryStocks } = salesOrder;
    const { products, ...restParams } = req.body;
    Object.assign(salesOrder, restParams);
    await salesOrder.save();

    for (var index = 0; index < ChairStocks.length; index++) {
      if (!ChairStocks[index].ChairToOrder.preOrder) {
        const stock = await chairStockController.getById(ChairStocks[index].id);
        await stock.increment({ balance: ChairStocks[index].ChairToOrder.qty });
        await stock.increment({ qty: ChairStocks[index].ChairToOrder.qty });
      }
      await salesOrder.removeChairStock(ChairStocks[index]);
    }

    for (var index = 0; index < DeskStocks.length; index++) {
      if (!DeskStocks[index].DeskToOrder.preOrder) {
        const stock = await deskStockController.getById(DeskStocks[index].id);
        await stock.increment({ balance: DeskStocks[index].DeskToOrder.qty });
        await stock.increment({ qty: DeskStocks[index].DeskToOrder.qty });
      }
      await salesOrder.removeDeskStock(DeskStocks[index].id);
    }

    for (var index = 0; index < AccessoryStocks.length; index++) {
      if (!AccessoryStocks[index].AccessoryToOrder.preOrder) {
        const stock = await accessoryStockController.getById(
          AccessoryStocks[index].id
        );
        await stock.increment({
          balance: AccessoryStocks[index].AccessoryToOrder.qty,
        });
        await stock.increment({
          qty: AccessoryStocks[index].AccessoryToOrder.qty,
        });
      }
      await salesOrder.removeAccessoryStock(AccessoryStocks[index].id);
    }

    // Delete services for this order
    db.ServiceToOrder.destroy({
      where: {
        orderId: id,
      },
    });

    for (var index = 0; index < products.length; index++) {
      if (products[index].productType === "chair") {
        const stock = await chairStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];

        await salesOrder.addChairStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      } else if (products[index].productType === "desk") {
        const stock = await deskStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }

        const {
          productId: stockId,
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        if (restParams.hasDeskTop) {
          if (restParams.topSketchURL) {
            const filepath =
              __dirname.split("controller")[0] +
              "uploads" +
              restParams.topSketchURL.split("uploads")[1];
            fs.unlinkSync(filepath);
          }

          const drawer = products.find(
            (item) =>
              item.productType === "accessory" &&
              item.productCategory === "Drawer"
          );

          const drawerAmount = drawer ? drawer.productAmount : null;

          const invoiceNum = `I-${salesOrder.Seller.prefix}${new Date(
            salesOrder.createdAt
          ).getFullYear()}-${orderInvoiceNum}`;
          restParams.topSketchURL = `${protocol}://${host}/${await drawDeskTop(
            {
              invoiceNum,
              ...restParams,
            },
            drawerAmount
          )}`;
        }
        const join1 = await db.DeskToOrder.create({
          unitPrice,
          qty,
          deliveryOption,
          preOrder,
          stockId: stockId,
          ...restParams,
        });
        await salesOrder.addDeskToOrder(join1);
      } else if (products[index].productType === "accessory") {
        const stock = await accessoryStockController.getById(
          products[index].productId
        );
        let preOrder = true;
        if (stock.balance >= products[index].productAmount) {
          preOrder = false;
          await stock.save();
          await stock.decrement({
            balance: products[index].productAmount,
          });
          await stock.decrement({ qty: products[index].productAmount });
        }
        const {
          productPrice: unitPrice,
          productAmount: qty,
          productDeliveryOption: deliveryOption,
          productType,
          ...restParams
        } = products[index];
        await salesOrder.addAccessoryStock(stock, {
          through: {
            unitPrice,
            qty,
            deliveryOption,
            preOrder,
            ...restParams,
          },
        });
      } else if (products[index].productType === "misc") {
        await db.ServiceToOrder.create({
          id: products[index].id,
          description: products[index].description,
          price: products[index].price,
          orderId: id,
        });
      }
    }
    res.json({ message: "SalesOrder was updated successfully." });
  } catch (err) {
    next(err);
  }
}

async function updateWithoutStock(id, params) {
  const salesOrder = await getSalesOrder(id);
  Object.assign(salesOrder, params);
  await salesOrder.save();
}

async function updateProducts(req, res, next) {
  try {
    const { chairToOrders, deskToOrders, accessoryToOrders } = req.body;
    for (var index = 0; index < chairToOrders.length; index++) {
      const { id, ...params } = chairToOrders[index];
      const chairToOrder = await db.ChairToOrder.findByPk(
        chairToOrders[index].id
      );
      Object.assign(chairToOrder, params);
      await chairToOrder.save();
    }
    for (index = 0; index < deskToOrders.length; index++) {
      const { id, ...params } = deskToOrders[index];
      const deskToOrder = await db.DeskToOrder.findByPk(deskToOrders[index].id);
      Object.assign(deskToOrder, params);
      await deskToOrder.save();
    }
    for (index = 0; index < accessoryToOrders.length; index++) {
      const { id, ...params } = accessoryToOrders[index];
      const accessoryToOrder = await db.AccessoryToOrder.findByPk(
        accessoryToOrders[index].id
      );
      Object.assign(accessoryToOrder, params);
      await accessoryToOrder.save();
    }
    res.json({ message: "Products were updated successfully." });
  } catch (err) {
    next(err);
  }
}

async function _delete(id) {
  const salesOrder = await getSalesOrder(id);
  const { ChairStocks, DeskStocks, AccessoryStocks } = salesOrder;
  for (var index = 0; index < ChairStocks.length; index++) {
    if (!ChairStocks[index].ChairToOrder.preOrder) {
      const stock = await chairStockController.getById(ChairStocks[index].id);
      await stock.increment({ balance: ChairStocks[index].ChairToOrder.qty });
      await stock.increment({ qty: ChairStocks[index].ChairToOrder.qty });
    }
  }
  for (var index = 0; index < DeskStocks.length; index++) {
    if (!DeskStocks[index].DeskToOrder.preOrder) {
      const stock = await deskStockController.getById(DeskStocks[index].id);
      await stock.increment({ balance: DeskStocks[index].DeskToOrder.qty });
      await stock.increment({ qty: DeskStocks[index].DeskToOrder.qty });
    }
  }
  for (var index = 0; index < AccessoryStocks.length; index++) {
    if (!AccessoryStocks[index].AccessoryToOrder.preOrder) {
      const stock = await accessoryStockController.getById(
        AccessoryStocks[index].id
      );
      await stock.increment({
        balance: AccessoryStocks[index].AccessoryToOrder.qty,
      });
      await stock.increment({
        qty: AccessoryStocks[index].AccessoryToOrder.qty,
      });
      await stock.save();
    }
  }
  await salesOrder.destroy();
}

async function _bulkDelete(where) {
  const salesOrders = await getAll(where);
  for (var orderIndex = 0; orderIndex < salesOrders.length; orderIndex++) {
    const { ChairStocks, DeskStocks, AccessoryStocks } =
      salesOrders[orderIndex];
    for (var index = 0; index < ChairStocks.length; index++) {
      if (!ChairStocks[index].ChairToOrder.preOrder) {
        const stock = await chairStockController.getById(ChairStocks[index].id);
        await stock.increment({ balance: ChairStocks[index].ChairToOrder.qty });
        await stock.increment({ qty: ChairStocks[index].ChairToOrder.qty });
      }
    }
    for (var index = 0; index < DeskStocks.length; index++) {
      if (!DeskStocks[index].DeskToOrder.preOrder) {
        const stock = await deskStockController.getById(DeskStocks[index].id);
        await stock.increment({ balance: DeskStocks[index].DeskToOrder.qty });
        await stock.increment({ qty: DeskStocks[index].DeskToOrder.qty });
      }
    }
    for (var index = 0; index < AccessoryStocks.length; index++) {
      if (!AccessoryStocks[index].AccessoryToOrder.preOrder) {
        const stock = await accessoryStockController.getById(
          AccessoryStocks[index].id
        );
        await stock.increment({
          balance: AccessoryStocks[index].AccessoryToOrder.qty,
        });
        await stock.increment({
          qty: AccessoryStocks[index].AccessoryToOrder.qty,
        });
      }
    }
  }
  return await db.SalesOrder.destroy({ where });
}

async function signDelivery(id, signature) {
  const salesOrder = await getSalesOrder(id);
  if (salesOrder.finished) throw "This Order is already finished!";
  const dirpath = "uploads/signature";
  const filepath = `${dirpath}/${Date.now()}.png`;
  fs.writeFileSync(`server/${filepath}`, signature, "base64");
  Object.assign(salesOrder, { signURL: filepath, finished: true });
  await salesOrder.save();
  return salesOrder.get();
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

async function getInvoiceNum(year) {
  const salesOrder = await db.SalesOrder.findOne({
    attributes: [[Sequelize.fn("MAX", Sequelize.col("invoiceNum")), "max_inv"]],
    where: {
      createdAt: {
        [Sequelize.Op.lt]: `${year + 1}-01-01`,
        [Sequelize.Op.gte]: `${year}-01-01`,
      },
    },
    raw: true,
  });

  return salesOrder.max_inv + 1;
}
