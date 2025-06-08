-- CreateTable
CREATE TABLE `Laboratorio` (
    `CodLab` INTEGER NOT NULL AUTO_INCREMENT,
    `RazonSocial` VARCHAR(191) NOT NULL,
    `Ruc` VARCHAR(191) NOT NULL,
    `Direccion` VARCHAR(191) NOT NULL,
    `Contacto` VARCHAR(191) NOT NULL,
    `Telefono` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`CodLab`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenCompra` (
    `NumOrden` INTEGER NOT NULL AUTO_INCREMENT,
    `FechaEmision` DATETIME(3) NOT NULL,
    `Situacion` VARCHAR(191) NOT NULL,
    `Total` DOUBLE NOT NULL,
    `CodLab` INTEGER NOT NULL,

    PRIMARY KEY (`NumOrden`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrdenCompra` ADD CONSTRAINT `OrdenCompra_CodLab_fkey` FOREIGN KEY (`CodLab`) REFERENCES `Laboratorio`(`CodLab`) ON DELETE RESTRICT ON UPDATE CASCADE;
