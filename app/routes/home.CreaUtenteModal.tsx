import {Link} from "@remix-run/react";
import { useActionData } from "@remix-run/react";

type ActionData = {
    errors?: Record<string, string[]>;
};

export default function HomeCreaUtenteModal() {
    const actionData = useActionData<ActionData>();
    const errors = actionData?.errors ?? {};
    return (
        <>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg relative">
                        <Link
                            to="/home"
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:hover:text-white"
                        >
                            ✕
                        </Link>
                        <h2 className="text-xl font-semibold mb-4">Crea un nuovo utente</h2>
                        <form method="POST" action="/crea-utente">
                            <div className="mb-4">
                                <label htmlFor="nome" className="block text-sm font-medium">Nome</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    className="w-full p-2 mt-1 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="cognome" className="block text-sm font-medium">Cognome</label>
                                <input
                                    type="text"
                                    id="cognome"
                                    name="cognome"
                                    className="w-full p-2 mt-1 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-medium">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="w-full p-2 mt-1 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-2 mt-1 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full p-2 mt-1 border rounded-md"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                            </div>
                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="isAdmin"
                                    name="isAdmin"
                                    className="mr-2"
                                />
                                <label htmlFor="isAdmin" className="text-sm font-medium">
                                    Imposta come Admin
                                </label>
                            </div>

                            <button type="submit" className="bg-green-600 text-white p-2 rounded-md">
                                Registra Utente
                            </button>
                        </form>
                    </div>
                </div>
            )
        </>
    );
}
