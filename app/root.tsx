import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type {ActionFunction} from "@remix-run/node";

import "./tailwind.css";
import {logout} from "~/utils/auth.server";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


export const action: ActionFunction = async ({ request }) => {
  return logout(request); 
};

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      {!isLoginPage && (
        <nav className="bg-white dark:bg-gray-800 shadow p-4">
          <div className="mx-auto flex justify-between items-center">
            <span className="text-xl font-bold">testRemixApp</span>
            <div className="flex items-center space-x-4">
              <Link to="/home" className="hover:underline">Home</Link>
              <Link to="/profile" className="hover:underline">Profilo</Link>
              <form method="post" action="/logout">
                <button type="submit" className="hover:underline">Logout</button>
              </form>
            </div>
          </div>
        </nav>
      )}
      <main>
        <Outlet />
      </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
