/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId,produtoId]` on the table `Carrinho` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Carrinho_usuarioId_produtoId_key" ON "Carrinho"("usuarioId", "produtoId");
