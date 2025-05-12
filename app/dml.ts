import { prisma } from "./utils/db.server.ts";

async function dml() {
    try {
        const user = await prisma.utente.create({
            data: {
                nome: "testNome",
                cognome: "testCognome",
                email: "test@example.it",
                username: "admin1",
                password: "admin",
                bio: "test bio",
            },
        });

        console.log("Utente creato:", user);
    } catch (err) {
        console.error("Errore nella creazione utente:", err);
    } finally {
        await prisma.$disconnect();
    }
}

dml();
