import { ActionFunction, redirect } from "@remix-run/node";
import {sessionStorage} from "~/utils/sessions";
import {createUtente, getUtenteByUsername} from "~/models/utente.server";
import { UtenteSchema } from "~/utils/validation";


export const action: ActionFunction = async ({ request }) => {
    /*const formData = new URLSearchParams(await request.text());*/
    const formData = await request.formData();
    /*const nome = formData.get("nome");
    const cognome = formData.get("cognome");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const isAdmin = formData.get("isAdmin") === "on";*/
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const rawData = {
        nome: formData.get("nome"),
        cognome: formData.get("cognome"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        isAdmin: formData.get("isAdmin") === "on", // checkbox -> boolean
    };
    const result = UtenteSchema.safeParse(rawData);
    if (!result.success) {
        const allErrors = Object.values(result.error.flatten().fieldErrors)
            .flat()
            .filter(Boolean); // rimuove eventuali undefined/null

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
    /*await createUtente({nome, cognome, email, username, password, isAdmin, bio: null})*/
        /*await prisma.utente.create({
            data: {
                nome,
                cognome,
                username,
                email,
                password,
            },
        });*/
    session.flash("flash", { type: "success", message: "Utente creato con successo." });
    return redirect("/home", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
};
