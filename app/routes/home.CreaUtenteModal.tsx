import {Link} from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import { ActionFunction, redirect, json} from "@remix-run/node";
import {sessionStorage} from "~/utils/sessions";
import {createUtente, getUtenteByUsername} from "~/models/utente.server";
import { UtenteSchema } from "~/utils/validation";

type ActionData = {
  success?: boolean;
  errors?: Record<string, string[]>;
  values?: Record<string, any>;
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const rawData = {
        nome: formData.get("nome"),
        cognome: formData.get("cognome"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        isAdmin: formData.get("isAdmin") === "on", 
    };
    const result = UtenteSchema.safeParse(rawData);
    const errors: Record<string, string[]> = {};

    
    if (!result.success) {
        Object.assign(errors, result.error.flatten().fieldErrors);
    }
    
    const existingUser = await getUtenteByUsername(rawData.username as string);
    if (existingUser) {
        errors.username = ["Username già utilizzato"];
    }

    if (Object.keys(errors).length > 0) {
        return json<ActionData>(
            { success: false, errors, values: rawData },
            { status: 400 }
        );
    }   

    await createUtente({
        ...result.data,
        bio: null,
    });

    session.flash("flash", {
        type: "success",
        message: "Utente creato con successo.",
    });

    return redirect("/home", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export default function HomeCreaUtenteModal() {
    const actionData = useActionData<ActionData>();
    const errors = actionData?.errors ?? {};
    const values = actionData?.values ?? {};
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
                        <form method="POST">
                            {["nome", "cognome", "username", "email", "password"].map((field) => (
                            <div key={field} className="mb-4">
                            <label htmlFor={field} className="block text-sm font-medium">
                                {field[0].toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type={field === "password" ? "password" : "text"}
                                id={field}
                                name={field}
                                className="w-full p-2 mt-1 border rounded-md"
                                defaultValue={values[field] || ""}
                            />
                            {errors[field]?.map((errorMsg, idx) => (
                            <p key={idx} className="text-red-500 text-sm">
                                {errorMsg}
                            </p>
                            ))}
                                </div>
                            ))}
                                <div className="mb-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isAdmin"
                                        name="isAdmin"
                                        className="mr-2"
                                        defaultChecked={values.isAdmin === true}
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
