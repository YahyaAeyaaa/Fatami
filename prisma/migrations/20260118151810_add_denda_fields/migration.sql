-- AlterTable
ALTER TABLE "returns" ADD COLUMN     "denda" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "denda_dibayar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hari_telat" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tanggal_bayar_denda" TIMESTAMP(3);
