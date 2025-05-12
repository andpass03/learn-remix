import { ActionFunction, redirect } from "@remix-run/node";
import {sessionStorage} from "~/utils/sessions";
import {createUtente, getUtenteByUsername} from "~/models/utente.server";

export const action: ActionFunction = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const nome = formData.get("nome");
    const cognome = formData.get("cognome");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const existingUser = await getUtenteByUsername(username)/*await prisma.utente.findUnique({ where: { username } })*/;
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    if (existingUser) {
        session.flash("flash", { type: "error", message: "Username già utilizzato." });
        return redirect("/home", {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session),
            },
        });
    }

    if (typeof email === "string" && typeof password === "string") {
        await createUtente({nome, cognome, email, username, password, bio: null})
        /*await prisma.utente.create({
            data: {
                nome,
                cognome,
                username,
                email,
                password,
            },
        });*/
    }
    session.flash("flash", { type: "success", message: "Utente creato con successo." });
    return redirect("/home", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
};
