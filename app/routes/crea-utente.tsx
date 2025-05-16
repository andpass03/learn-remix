import { ActionFunction, redirect } from "@remix-run/node";
import {sessionStorage} from "~/utils/sessions";
import {createUtente, getUtenteByUsername} from "~/models/utente.server";
import { UtenteSchema } from "~/utils/validation";


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
    if (!result.success) {
        const allErrors = Object.values(result.error.flatten().fieldErrors)
            .flat()
            .filter(Boolean); 
        session.flash("flash", {
            type: "error",
            messages: allErrors,
        });

        return redirect("/home", {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session),
            },
        });
    }

    const existingUser = await getUtenteByUsername(result.data.username)/*await prisma.utente.findUnique({ where: { username } })*/;
    if (existingUser) {
        session.flash("flash", { type: "error", message: "Username già utilizzato." });
        return redirect("/home", {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session),
            },
        });
    }

    await createUtente({
        ...result.data,
        bio: null,
    });

    session.flash("flash", { type: "success", message: "Utente creato con successo." });
    return redirect("/home", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
};


