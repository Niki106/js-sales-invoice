-- --------------------------------------------------------
-- Host:                         blueoceanblue.com
-- Server version:               8.0.36-0ubuntu0.20.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table sales_invoice.accessorystocks
CREATE TABLE IF NOT EXISTS `accessorystocks` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `category` varchar(255) NOT NULL DEFAULT '',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `thumbnailURL` varchar(255) NOT NULL DEFAULT '',
  `unitPrice` float NOT NULL DEFAULT '1000',
  `isRegistered` tinyint(1) NOT NULL DEFAULT '0',
  `balance` int NOT NULL DEFAULT '0',
  `qty` int NOT NULL DEFAULT '0',
  `shipmentDate` date DEFAULT NULL,
  `arrivalDate` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.accessorytoorders
CREATE TABLE IF NOT EXISTS `accessorytoorders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `unitPrice` float NOT NULL DEFAULT '1000',
  `qty` int NOT NULL DEFAULT '1',
  `deliveryOption` varchar(255) NOT NULL DEFAULT 'Delivery Included',
  `preOrder` tinyint(1) NOT NULL DEFAULT '0',
  `preDeliveryDate` date DEFAULT NULL,
  `estDeliveryDate` date DEFAULT NULL,
  `from` time DEFAULT NULL,
  `to` time DEFAULT NULL,
  `delivered` tinyint(1) NOT NULL DEFAULT '0',
  `poNum` tinyint(1) NOT NULL DEFAULT '0',
  `signURL` varchar(255) NOT NULL DEFAULT '',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `orderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `shipmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `accessorytoorders_orderId_foreign_idx` (`orderId`),
  KEY `accessorytoorders_stockId_foreign_idx` (`stockId`),
  KEY `accessorytoorders_shipmentId_foreign_idx` (`shipmentId`),
  CONSTRAINT `accessorytoorders_orderId_foreign_idx` FOREIGN KEY (`orderId`) REFERENCES `salesorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `accessorytoorders_shipmentId_foreign_idx` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `accessorytoorders_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `accessorystocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.accessorytoquotations
CREATE TABLE IF NOT EXISTS `accessorytoquotations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `unitPrice` float NOT NULL DEFAULT '1000',
  `qty` int NOT NULL DEFAULT '1',
  `deliveryOption` varchar(255) NOT NULL DEFAULT 'Delivery Included',
  `remark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `accessorytoquotations_quotationId_foreign_idx` (`quotationId`),
  KEY `accessorytoquotations_stockId_foreign_idx` (`stockId`),
  CONSTRAINT `accessorytoquotations_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `accessorystocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_accessorytoquotations_quotations` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.accessorytoshipments
CREATE TABLE IF NOT EXISTS `accessorytoshipments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `client` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `qty` int NOT NULL DEFAULT '1',
  `orderedQty` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `shipmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `accessorytoshipments_stockId_foreign_idx` (`stockId`) USING BTREE,
  KEY `accessorytoshipments_shipmentId_foreign_idx` (`shipmentId`) USING BTREE,
  CONSTRAINT `accessorytoshipments_shipmentId_foreign_idx` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `accessorytoshipments_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `accessorystocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.chairstocks
CREATE TABLE IF NOT EXISTS `chairstocks` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `brand` varchar(255) NOT NULL DEFAULT '',
  `model` varchar(255) NOT NULL DEFAULT '',
  `frameColor` varchar(255) NOT NULL DEFAULT '',
  `backColor` varchar(255) NOT NULL DEFAULT '',
  `seatColor` varchar(255) NOT NULL DEFAULT '',
  `backMaterial` varchar(255) NOT NULL DEFAULT '',
  `seatMaterial` varchar(255) NOT NULL DEFAULT '',
  `withHeadrest` tinyint(1) NOT NULL DEFAULT '1',
  `withAdArmrest` tinyint(1) NOT NULL DEFAULT '1',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `thumbnailURL` varchar(255) NOT NULL DEFAULT '',
  `unitPrice` float NOT NULL DEFAULT '1000',
  `balance` int NOT NULL DEFAULT '0',
  `qty` int NOT NULL DEFAULT '0',
  `shipmentDate` date DEFAULT NULL,
  `arrivalDate` date DEFAULT NULL,
  `isRegistered` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.chairtoorders
CREATE TABLE IF NOT EXISTS `chairtoorders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `unitPrice` float NOT NULL DEFAULT '1000',
  `qty` int NOT NULL DEFAULT '1',
  `deliveryOption` varchar(255) NOT NULL DEFAULT 'Delivery Included',
  `preOrder` tinyint(1) NOT NULL DEFAULT '0',
  `preDeliveryDate` date DEFAULT NULL,
  `estDeliveryDate` date DEFAULT NULL,
  `from` time DEFAULT NULL,
  `to` time DEFAULT NULL,
  `delivered` tinyint(1) NOT NULL DEFAULT '0',
  `poNum` varchar(255) NOT NULL DEFAULT '',
  `signURL` varchar(255) NOT NULL DEFAULT '',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `orderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `shipmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chairtoorders_orderId_foreign_idx` (`orderId`),
  KEY `chairtoorders_stockId_foreign_idx` (`stockId`),
  KEY `chairtoorders_shipmentId_foreign_idx` (`shipmentId`),
  CONSTRAINT `chairtoorders_orderId_foreign_idx` FOREIGN KEY (`orderId`) REFERENCES `salesorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chairtoorders_shipmentId_foreign_idx` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chairtoorders_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `chairstocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.chairtoquotations
CREATE TABLE IF NOT EXISTS `chairtoquotations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `unitPrice` float NOT NULL DEFAULT '1000',
  `qty` int NOT NULL DEFAULT '1',
  `deliveryOption` varchar(255) NOT NULL DEFAULT 'Delivery Included',
  `remark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chairtoquotations_quotationId_foreign_idx` (`quotationId`),
  KEY `chairtoquotations_stockId_foreign_idx` (`stockId`),
  CONSTRAINT `chairtoquotations_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `chairstocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_chairtoquotations_quotations` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.chairtoshipments
CREATE TABLE IF NOT EXISTS `chairtoshipments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `client` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `qty` int NOT NULL DEFAULT '1',
  `orderedQty` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `shipmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `chairtoshipments_stockId_foreign_idx` (`stockId`) USING BTREE,
  KEY `chairtoshipments_shipmentId_foreign_idx` (`shipmentId`) USING BTREE,
  CONSTRAINT `chairtoshipments_shipmentId_foreign_idx` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chairtoshipments_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `chairstocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.deskstocks
CREATE TABLE IF NOT EXISTS `deskstocks` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `supplierCode` varchar(255) NOT NULL DEFAULT '',
  `model` varchar(255) NOT NULL DEFAULT '',
  `color` varchar(255) NOT NULL DEFAULT '',
  `armSize` varchar(255) NOT NULL DEFAULT '',
  `feetSize` varchar(255) NOT NULL DEFAULT '',
  `beamSize` varchar(255) NOT NULL DEFAULT '',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `thumbnailURL` varchar(255) NOT NULL DEFAULT '',
  `unitPrice` float NOT NULL DEFAULT '1000',
  `isRegistered` tinyint(1) NOT NULL DEFAULT '0',
  `balance` int NOT NULL DEFAULT '0',
  `qty` int NOT NULL DEFAULT '0',
  `shipmentDate` date DEFAULT NULL,
  `arrivalDate` date DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.desktoorders
CREATE TABLE IF NOT EXISTS `desktoorders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `hasDeskTop` tinyint(1) NOT NULL DEFAULT '0',
  `topMaterial` varchar(255) NOT NULL DEFAULT '',
  `topColor` varchar(255) NOT NULL DEFAULT '',
  `topLength` float NOT NULL DEFAULT '800',
  `topWidth` float NOT NULL DEFAULT '600',
  `topThickness` float NOT NULL DEFAULT '25',
  `topRoundedCorners` int NOT NULL DEFAULT '0',
  `topCornerRadius` float NOT NULL DEFAULT '0',
  `topHoleCount` int NOT NULL DEFAULT '0',
  `topHoleType` varchar(255) NOT NULL DEFAULT 'Rounded',
  `topHolePosition` varchar(255) NOT NULL DEFAULT 'Rounded',
  `topSketchURL` varchar(255) NOT NULL DEFAULT '',
  `unitPrice` float NOT NULL DEFAULT '1000',
  `qty` int NOT NULL DEFAULT '1',
  `deliveryOption` varchar(255) NOT NULL DEFAULT 'Delivery Included',
  `preOrder` tinyint(1) NOT NULL DEFAULT '0',
  `preDeliveryDate` date DEFAULT NULL,
  `estDeliveryDate` date DEFAULT NULL,
  `from` time DEFAULT NULL,
  `to` time DEFAULT NULL,
  `delivered` tinyint(1) NOT NULL DEFAULT '0',
  `akNum` varchar(255) NOT NULL DEFAULT '',
  `heworkNum` varchar(255) NOT NULL DEFAULT '',
  `signURL` varchar(255) NOT NULL DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `orderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `shipmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `desktoorders_orderId_foreign_idx` (`orderId`),
  KEY `desktoorders_stockId_foreign_idx` (`stockId`),
  KEY `desktoorders_shipmentId_foreign_idx` (`shipmentId`),
  CONSTRAINT `desktoorders_orderId_foreign_idx` FOREIGN KEY (`orderId`) REFERENCES `salesorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `desktoorders_shipmentId_foreign_idx` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `desktoorders_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `deskstocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.desktoquotations
CREATE TABLE IF NOT EXISTS `desktoquotations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `hasDeskTop` tinyint(1) NOT NULL DEFAULT '0',
  `topMaterial` varchar(255) NOT NULL DEFAULT '',
  `topColor` varchar(255) NOT NULL DEFAULT '',
  `topLength` float NOT NULL DEFAULT '800',
  `topWidth` float NOT NULL DEFAULT '600',
  `topThickness` float NOT NULL DEFAULT '25',
  `topRoundedCorners` int NOT NULL DEFAULT '0',
  `topCornerRadius` float NOT NULL DEFAULT '0',
  `topHoleCount` int NOT NULL DEFAULT '0',
  `topHoleType` varchar(255) NOT NULL DEFAULT 'Rounded',
  `topHolePosition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Left',
  `topSketchURL` varchar(255) NOT NULL DEFAULT '',
  `unitPrice` float NOT NULL DEFAULT '1000',
  `qty` int NOT NULL DEFAULT '1',
  `deliveryOption` varchar(255) NOT NULL DEFAULT 'Delivery Included',
  `remark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `desktoquotations_quotationId_foreign_idx` (`quotationId`),
  KEY `desktoquotations_stockId_foreign_idx` (`stockId`),
  CONSTRAINT `desktoquotations_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `deskstocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_desktoquotations_quotations` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.desktoshipments
CREATE TABLE IF NOT EXISTS `desktoshipments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `client` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `qty` int NOT NULL DEFAULT '1',
  `orderedQty` int NOT NULL,
  `hasDeskTop` tinyint(1) NOT NULL DEFAULT '0',
  `topColor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `topMaterial` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `shipmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `stockId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `desktoshipments_stockId_foreign_idx` (`stockId`) USING BTREE,
  KEY `desktoshipments_shipmentId_foreign_idx` (`shipmentId`) USING BTREE,
  CONSTRAINT `desktoshipments_shipmentId_foreign_idx` FOREIGN KEY (`shipmentId`) REFERENCES `shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `desktoshipments_stockId_foreign_idx` FOREIGN KEY (`stockId`) REFERENCES `deskstocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.quotations
CREATE TABLE IF NOT EXISTS `quotations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quotationNum` int NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL DEFAULT '',
  `district` varchar(255) NOT NULL DEFAULT '',
  `street` varchar(255) NOT NULL DEFAULT '',
  `block` varchar(255) NOT NULL DEFAULT '',
  `floor` varchar(255) NOT NULL DEFAULT '',
  `unit` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `timeLine` int NOT NULL DEFAULT '10',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `paymentTerms` varchar(255) NOT NULL DEFAULT '',
  `validTil` int NOT NULL DEFAULT '1',
  `discount` float NOT NULL DEFAULT '0',
  `discountType` int NOT NULL DEFAULT '1',
  `surcharge` float NOT NULL DEFAULT '0',
  `surchargeType` int NOT NULL DEFAULT '1',
  `finished` tinyint(1) NOT NULL DEFAULT '0',
  `isPreorder` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sellerId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quotations_sellerId_foreign_idx` (`sellerId`),
  CONSTRAINT `quotations_sellerId_foreign_idx` FOREIGN KEY (`sellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.salesorders
CREATE TABLE IF NOT EXISTS `salesorders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `invoiceNum` int NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL DEFAULT '',
  `district` varchar(255) NOT NULL DEFAULT '',
  `street` varchar(255) NOT NULL DEFAULT '',
  `block` varchar(255) NOT NULL DEFAULT '',
  `floor` varchar(255) NOT NULL DEFAULT '',
  `unit` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `timeLine` int NOT NULL DEFAULT '10',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `signURL` varchar(255) NOT NULL DEFAULT '',
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `paymentTerms` varchar(255) NOT NULL DEFAULT '',
  `dueDate` date DEFAULT NULL,
  `discount` float NOT NULL DEFAULT '0',
  `discountType` int NOT NULL DEFAULT '1',
  `surcharge` float NOT NULL DEFAULT '0',
  `surchargeType` int NOT NULL DEFAULT '1',
  `finished` tinyint(1) NOT NULL DEFAULT '0',
  `isPreorder` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sellerId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `salesorders_sellerId_foreign_idx` (`sellerId`),
  CONSTRAINT `salesorders_sellerId_foreign_idx` FOREIGN KEY (`sellerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.SequelizeMeta
CREATE TABLE IF NOT EXISTS `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.sequelizemeta
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.servicetoorders
CREATE TABLE IF NOT EXISTS `servicetoorders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `description` varchar(255) NOT NULL DEFAULT '',
  `orderId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `servicetoorders_orderId_foreign_idx` (`orderId`),
  CONSTRAINT `servicetoorders_orderId_foreign_idx` FOREIGN KEY (`orderId`) REFERENCES `salesorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.servicetoquotations
CREATE TABLE IF NOT EXISTS `servicetoquotations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `description` varchar(255) NOT NULL DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `servicetoquotations_quotationId_foreign_idx` (`quotationId`),
  CONSTRAINT `servicetoquotations_quotationId_foreign_idx` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.shipments
CREATE TABLE IF NOT EXISTS `shipments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `poNum` int NOT NULL DEFAULT '0',
  `itemType` enum('A','C','D') NOT NULL DEFAULT 'A',
  `stockId` char(36) NOT NULL DEFAULT '',
  `qty` int NOT NULL DEFAULT '0',
  `orderId` char(36) DEFAULT '0',
  `orderQty` int DEFAULT '0',
  `finishDate` date DEFAULT NULL,
  `location` varchar(127) DEFAULT NULL,
  `supplier` varchar(127) DEFAULT NULL,
  `beam` varchar(127) DEFAULT NULL,
  `akNum` varchar(127) DEFAULT NULL,
  `heworkNum` varchar(127) DEFAULT NULL,
  `remark` varchar(127) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table sales_invoice.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) NOT NULL DEFAULT '',
  `firstName` varchar(255) NOT NULL DEFAULT '',
  `lastName` varchar(255) NOT NULL DEFAULT '',
  `avatarURL` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `type` varchar(255) NOT NULL DEFAULT '',
  `prefix` char(2) NOT NULL DEFAULT '',
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
