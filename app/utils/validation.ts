import { z } from "zod";

export const UtenteSchema = z
    .object({
        nome: z.string().min(1, "Nome obbligatorio"),
        cognome: z.string().min(1, "Cognome obbligatorio"),
        username: z.string(),
        email: z.string().email("Email non valida"),
        password: z.string(),
        isAdmin: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        const password = data.password;
        const username = data.username;
        if(password.length < 6) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La password deve essere lunga almeno 6 caratteri",
                path: ["password"],
            });
        }

        if(!/[a-z]/.test(password)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La password deve contenere almeno una lettera minuscola",
                path: ["password"],
            })
        }


        if(!/[A-Z]/.test(password)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La password deve contenere almeno una lettera MAIUSCOLA",
                path: ["password"],
            })
        }

        if(!/\d/.test(password)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La password deve contenere almeno un numero",
                path: ["password"],
            })
        }

        if(!/[\W_]/.test(password)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La password deve contenere almeno un carattere speciale",
                path: ["password"]
            })
        }

        if(username.length == 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Username obbligatorio",
                path: ["username"],
            })
        } else if (username.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Username troppo corto",
                path: ["username"]
            })
        }
    })
;
