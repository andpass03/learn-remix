import {createCookieSessionStorage, redirect} from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET non impostata in .env");
}

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
});




