import { LoaderFunction, redirect, ActionFunction, json } from "@remix-run/node";
import { requireUser } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { useLoaderData, Outlet, Link } from "@remix-run/react";
import { sessionStorage } from "~/utils/sessions";

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
    const { user, cities, isAdmin, message } = useLoaderData<typeof loader>();
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <main className="max-w-6xl mx-auto p-8">
                <h2 className="text-3xl font-bold mb-6">Benvenuto nella homepage</h2>
                <h1 className="text-6xl font-bold mb-6 text-purple-500">{user.nome} {user.cognome}</h1>
                {message && (
                    <div
                        className={`p-2 mb-4 rounded-md text-white ${message.type === "success" ? "bg-green-600" : "bg-red-600"
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
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                        Crea Utente
                    </Link>)}

                <Outlet />
                <button
                    onClick={() => handleDownloadPDF(cities)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                    Scarica elenco città (PDF)
                </button>



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

async function handleDownloadPDF(cities: { nome: string; descrizione: string }[]) {

    const jsPDFModule = await import("jspdf");
    const doc = new jsPDFModule.jsPDF();

    let y = 30;
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("Elenco delle città visitate", 14, 22);

    doc.setTextColor(0, 0, 0);
    cities.forEach((citta, index) => {

        doc.setFontSize(14);
        doc.text(`${index + 1}.`, 14, y);
        
        y += 4;

        doc.setFontSize(11);
        doc.text(`Nome: ${citta.nome}`, 18, y);
        y += 7;
        doc.text("Bio: " + (citta.descrizione ?? "Nessuna Bio"), 18, y);
        y += 10;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save("elenco_citta.pdf");
}