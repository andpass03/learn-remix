import { Link } from "@remix-run/react";
import {ActionFunction, redirect} from "@remix-run/node";
import {requireUser} from "~/utils/auth.server";
import {prisma} from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
    const user = await requireUser(request);
    const formData = new URLSearchParams(await request.text());
    const nome = formData.get("name");
    const descrizione = formData.get("description");
    if (nome) {
        await prisma.citta.create({
            data: {
                nome,
                descrizione: descrizione || null,
                userId: user.id,
            },
        });
    }

    return redirect("/home");
};

export default function HomeAggiungiCitta() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg relative">
                <Link
                    to="/home"
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white"
                >
                    ✕
                </Link>
                <h2 className="text-xl font-semibold mb-4">Aggiungi una Città</h2>
                <form method="POST">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                        <input type="text" id="name" name="name" className="w-full p-2 mt-1 border rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium">Descrizione</label>
                        <textarea id="description" name="description" className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Salva Città</button>
                </form>
            </div>
        </div>
    );
}