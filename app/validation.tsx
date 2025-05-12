import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function validateLoginData(username: string, password: string) {
    const user = await prisma.utente.findUnique({
        where: { username },
    })

    if(!user) {
        return { success: false, message: "Credenziali non valide." };
    }

    if (user.password !== password) {
        return { success: false, message: "Credenziali non valide." };
    }

    const { password: _, ...userWithoutPassword } = user;
    console.log(userWithoutPassword);

    return { success: true, message: "Accesso riuscito!", user: userWithoutPassword };
}
