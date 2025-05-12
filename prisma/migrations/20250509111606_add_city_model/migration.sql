-- CreateTable
CREATE TABLE "Citta" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descrione" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Citta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Citta" ADD CONSTRAINT "Citta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
