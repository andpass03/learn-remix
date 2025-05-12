import { Form, useActionData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import {ActionFunction, json, MetaFunction, redirect} from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const user = await authenticator.authenticate("user-pass", request);
    console.log("Autenticato:", user);
    return redirect("/home", {
      headers: {
        "Set-Cookie": user.cookieHeader,
      },
    });
  } catch (error: any) {
    console.error("Errore login:", error);
    return json({ success: false, message: error.message }, { status: 400 });
  }

};

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login page for the app" },
  ];
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-16">
          <header className="flex flex-col items-center gap-9">
            <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
              Welcome to <span className="sr-only">Remix</span>
            </h1>
            <div className="h-[144px] w-[434px]">
              <img src="/logo-light.png" alt="Remix" className="block w-full dark:hidden" />
              <img src="/logo-dark.png" alt="Remix" className="hidden w-full dark:block" />
            </div>
          </header>
          <Form method="post" className="flex flex-col gap-2 w-80" encType="application/x-www-form-urlencoded">
            <label htmlFor="username">Username</label>
            <input
                className="w-72 px-4 py-2 rounded-xl border"
                name="username"
                id="username"
                type="text"
                required
            />
            <label htmlFor="password">Password</label>
            <input
                className="w-72 px-4 py-2 rounded-xl border"
                name="password"
                id="password"
                type="password"
                required
            />
            {actionData && (
                <p className="text-red-500">{actionData.message}</p>
            )}
            <button type="submit" className="mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
              Login
            </button>
          </Form>
        </div>
      </div>
  );
}
