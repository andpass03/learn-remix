import {LoaderFunction, redirect, ActionFunction, json} from "@remix-run/node";
import { requireUser } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import {useLoaderData, Outlet, Link} from "@remix-run/react";
import {sessionStorage} from "~/utils/sessions";


export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireUser(request);
    const cities = await prisma.citta.findMany({
        where: { userId: user.id },
    });
    const isAdmin = user.isAdmin;
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


export default function Home() {
    const { user, cities, isAdmin, message} = useLoaderData<typeof loader>();
    return  (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <main className="max-w-6xl mx-auto p-8">
                <h2 className="text-3xl font-bold mb-6">Benvenuto nella homepage</h2>
                <h1 className="text-6xl font-bold mb-6 text-purple-500">{user.nome} {user.cognome}</h1>
                {message && (
                    <div
                        className={`p-2 mb-4 rounded-md text-white ${
                            message.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {Array.isArray(message.messages) ? (
                            <ul className="list-disc pl-5">
                                {message.messages.map((err: string) => (
                                    <li>{err}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{message.message}</p>
                        )}
                    </div>
                )}

                <Link
                    to={'aggiungi-citta'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Aggiungi città visitata
                </Link>
                {isAdmin && (
                    <Link
                    to={'CreaUtenteModal'}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                    Crea Utente
                </Link>)}


                <Outlet />
                {/*showModal && (
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
                )*/}
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