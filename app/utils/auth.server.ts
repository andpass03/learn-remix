import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "./sessions";
import { validateLoginData } from "~/validation";
import {redirect} from "@remix-run/node";

type User = {
    id: number;
    username: string;
};

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
    new FormStrategy(async ({ form }) => {
        const username = form.get("username")?.toString() ?? "";
        const password = form.get("password")?.toString() ?? "";

        const result = await validateLoginData(username, password);
        console.log("LOGIN RESULT", result);
        if (result.success && result.user) {
            const session = await sessionStorage.getSession();
            session.set("user",  result.user );
            const cookieHeader = await sessionStorage.commitSession(session);
            return { user: result.user, cookieHeader };
        }

        throw new Error(result.message ?? "Credenziali non valide");
    }),
    "user-pass"
);

export async function requireUser(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    console.log("SESSION RESULT", session);
    const user = session.get("user");
    console.log("USER RESULT", user);
    if (!user) throw redirect("/");

    return user;
}

export async function logout(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    session.unset("user");
    const cookie = await sessionStorage.commitSession(session);
    return redirect("/", {
        headers: {
            "Set-Cookie": cookie,
        },
    });
}