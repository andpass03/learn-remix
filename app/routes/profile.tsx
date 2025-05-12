import { json, redirect, type ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import {useLoaderData} from "@remix-run/react";
import { requireUser } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import {updateUtente} from "~/models/utente.server";


type ProfileData = {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    bio: string;
};

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireUser(request);
    const profile = await prisma.utente.findUnique({
        where: { id: user.id },
    });
    if (!profile) throw new Response("User not found", { status: 404 });

    return json({
        id: profile.id,
        name: profile.nome,
        surname: profile.cognome,
        email: profile.email,
        bio: profile.bio,
    });
};

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const nome = formData.get("name")?.toString() ?? "";
    const cognome = formData.get("surname")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const bio = formData.get("bio")?.toString() ?? "";
    const user = await requireUser(request);
    /*await prisma.utente.update({
        where: { id: user.id },
        data: { nome, cognome, email, bio },
    });*/
    await updateUtente(user.id, {nome, cognome, email, bio});

    return json({
        message: "Profilo aggiornato",
        values: {nome, cognome, email, bio},
    });
};

export default function ProfilePage() {
    const loaderData = useLoaderData<ProfileData>();

    const data = useActionData<typeof action>();
    const values = data?.values ?? loaderData;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
                <h1 className="text-2xl font-bold mb-6">Profilo Utente</h1>

                {data?.message && (
                    <p className="mb-4 text-green-600 font-medium">{data.message}</p>
                )}

                <Form method="post" className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name" className="block mb-1 font-semibold">
                            Nome
                        </label>
                        <input
                            id="name"
                            name="name"
                            defaultValue={values.name}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="surname" className="block mb-1 font-semibold">
                            Cognome
                        </label>
                        <input
                            id="surname"
                            name="surname"
                            defaultValue={values.surname}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 font-semibold">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={values.email}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block mb-1 font-semibold">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            defaultValue={values.bio}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            rows={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="self-start bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
                    >
                        Salva modifiche
                    </button>
                </Form>
            </div>
        </div>
    );



}

