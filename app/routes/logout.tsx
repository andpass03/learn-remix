import { ActionFunction } from "@remix-run/node";
import { logout } from "~/utils/auth.server"; // Assicurati che questa funzione esista per il logout

export const action: ActionFunction = async ({ request }) => {
    return logout(request); // Esegui la funzione di logout che distrugge la sessione
};

export default function LogoutPage() {
    return (
        <form method="post" action="/logout">
            <button type="submit" className="hover:underline">Logout</button>
        </form>
    );
}