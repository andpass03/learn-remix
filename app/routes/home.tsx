import {LoaderFunction, redirect, ActionFunction, json} from "@remix-run/node";
import { requireUser } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import CreaUtenteModal from "~/components/CreaUtenteModal";
import {sessionStorage} from "~/utils/sessions";


export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireUser(request);
    const cities = await prisma.citta.findMany({
        where: { userId: user.id },
    });
    const isAdmin = user.username === 'admin';
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));

    const message = session.get("flash") || null;


    return json(
        { user, cities, isAdmin, message },
        {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session),
            },
        }
    );
};

export const action: ActionFunction = async ({ request }) => {
    const user = await requireUser(request);
    const formData = new URLSearchParams(await request.text());
    const nome = formData.get("name");
    const descrizione = formData.get("description");
    if (nome && descrizione) {
        await prisma.citta.create({
            data: {
                nome,
                descrizione,
                userId: user.id,
            },
        });
    }

    return redirect("/home");
};

export default function Home() {
    const { cities, isAdmin, message} = useLoaderData<typeof loader>();
    const [showModal, setShowModal] = useState(false);
    return  (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <main className="max-w-6xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Benvenuto nella homepage</h1>
                {message && (
                    <p
                        className={`p-2 mb-4 rounded-md text-white ${
                            message.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {message.message}
                    </p>
                )}

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Aggiungi città visitata
                </button>
                <CreaUtenteModal  isAdmin={isAdmin}/>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white"
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-semibold mb-4">Aggiungi una Città</h2>
                            <form method="POST">
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full p-2 mt-1 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium">Descrizione</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="w-full p-2 mt-1 border rounded-md"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                                    Salva Città
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cities.map((citta) => (
                        <div key={citta.id} className="rounded-xl border p-4 shadow bg-white dark:bg-gray-800">
                            <h2 className="text-xl font-semibold mb-2">{citta.nome}</h2>
                            <p className="text-sm">{citta.descrizione}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}