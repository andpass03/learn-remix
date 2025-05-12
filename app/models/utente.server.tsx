import { prisma } from "~/utils/db.server";


export async function getUtenteByUsername(username: string) {
    return prisma.utente.findUnique({
        where: { username },
    });
}

export async function createUtente(data: { nome: string, cognome: string, email: string, username: string, password: string, bio: string }) {
    return prisma.utente.create({
        data,
    });
}

export async function updateUtente(id: number, data: { nome: string, cognome: string, email: string, username: string, bio: string }) {
    return prisma.utente.update({
        where: { id },
        data,
    });
}
