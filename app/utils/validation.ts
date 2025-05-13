import { z } from "zod";

export const UtenteSchema = z.object({
    nome: z.string().min(1, "Nome obbligatorio"),
    cognome: z.string().min(1, "Cognome obbligatorio"),
    username: z.string().min(3, "Username troppo corto"),
    email: z.string().email("Email non valida"),
    password: z
        .string()
        .min(6, "La password deve essere lunga almeno 6 caratteri")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
            "La password deve contenere almeno una maiuscola, una minuscola, un numero e un carattere speciale"
        ),    isAdmin: z.boolean().optional(),
});
