import { ActionFunction, redirect } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import {sessionStorage} from "~/utils/sessions";

export const action: ActionFunction = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const nome = formData.get("nome");
    const cognome = formData.get("cognome");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const existingUser = await prisma.utente.findUnique({ where: { username } });
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
        await prisma.utente.create({
            data: {
                nome,
                cognome,
                username,
                email,
                password,
            },
        });
    }
    session.flash("flash", { type: "success", message: "Utente creato con successo." });
    return redirect("/home", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
};
