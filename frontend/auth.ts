import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { authConfig } from "./auth.config";
import { getUserByEmail } from "./lib/db/users";
import { getUserWithPasswordHashByEmail } from "./lib/db/users.server-only";
import { signInSchema } from "./lib/zod/auth";
import { verifyPassword } from "./utils/misc";

const providers = [
  ...authConfig.providers,
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      try {
        const { email, password } = await signInSchema.parseAsync(credentials);
        const user = await getUserWithPasswordHashByEmail(email);
        if (!user || !user.passwordHash) return null; // || !user.emailVerified
        const result = await verifyPassword(
          password,
          Buffer.from(user.passwordHash.hash, "base64")
        );
        if (!result) return null;
        return await getUserByEmail(email);
      } catch (error) {
        if (error instanceof ZodError) {
          return null;
        }
        console.log(error);

        throw error;
      }
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
  },
  providers: [...providers],
});
