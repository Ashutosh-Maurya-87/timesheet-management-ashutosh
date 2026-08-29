import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { users } from "@/lib/mock-db";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },

                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const email =
                    credentials?.email as string;

                const password =
                    credentials?.password as string;

                const user = users.find(
                    (user) =>
                        user.email === email &&
                        user.password === password
                );

                if (!user) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
    },
});